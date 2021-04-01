// https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html
// https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
// https://threejs.org/docs/#api/en/core/BufferGeometry 
// https://discourse.threejs.org/t/solved-geometry-vertices-is-undefined/3133
// https://stackoverflow.com/questions/59949791/how-to-get-vertices-of-obj-model-object-in-three-js
// https://www.howtobuildsoftware.com/index.php/how-do/b2Qd/javascript-threejs-how-to-access-the-vertices-after-loading-object-with-objloader-in-threejs
// ray caster
// https://threejs.org/docs/index.html?q=ray#api/en/core/Raycaster 


// make vertex shader for smoke stack
// load an invisible smokestack
// use vertex shader on invisible smokestack
// use buffer geometry to be able to index all of the vertices by color
// use picking to know what vertex was clicked

function centerOnBBox(object) {
    // bounding box
    let box = new THREE.Box3().setFromObject(object);
    // dimensions of the bounding box
    let dimensions = new THREE.Vector3();
    box.getSize(dimensions);
    // center the model
    let boxCenter = box.getCenter(new THREE.Vector3());
    object.position.x += boxCenter.x;
    object.position.y += boxCenter.y;
    object.position.z += boxCenter.z;
    // set model upright
    object.rotation.x += 2.5;
}

// center the model
// fix github
class ArtCanvas {
    constructor() {
        let canvas = document.getElementById("threecanvas");
        const gl = canvas.getContext('webgl');
        var pixels = new Uint8Array(4 * gl.drawingBufferWidth * gl.drawingBufferHeight);

        let scene = new THREE.Scene();
        scene.background = new THREE.Color('gray');
        this.canvas = canvas;
        this.scene = scene;
        this.displayTexture = true;

        // camera
        const fov = 75;
        const aspect = 2;
        const near = 0.1;
        const far = 1000;
        let camera = new THREE.PerspectiveCamera(
            fov,
            aspect,
            near,
            far
        );
        camera.position.z = 50;
        this.camera = camera;

        // renderer
        let renderer = new THREE.WebGLRenderer( {canvas} ); // antiailiasing is off by default. https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); 
        this.renderer = renderer;

        // lighting
        const ambient = new THREE.AmbientLight( 0xFFFFFF );
        scene.add(ambient);

        // orbit controls
        let controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.update();
        controls.enableDamping = true;
        controls.campingFactor = 0.25;
        controls.enableZoom = true;
        this.controls = controls;

        // Setup placeholders for two meshes and picking material
        // (TODO: The could all be promises to make code more robust)
        this.textureMesh = null;
        this.pickerMesh = null;
        this.pickMat = null; // Picking material

        canvas.addEventListener("click", function(event){

            var eventLocation = getEventLocation(event);
            console.log(eventLocation);
            
            gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            
        
            // var context = canvas.getContext("webgl");
            // var pixelData = gl.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 
            
            const x = eventLocation.x
            const y = eventLocation.y
            
            var pixelR = pixels[4 * (y * gl.drawingBufferWidth + x)];
            var pixelG = pixels[4 * (y * gl.drawingBufferWidth + x) + 1];
            var pixelB = pixels[4 * (y * gl.drawingBufferWidth + x) + 2];
            var pixelA = pixels[4 * (y * gl.drawingBufferWidth + x) + 3];

            console.log(pixelR);
            console.log(pixelG);
            console.log(pixelB);
            console.log(pixelA);

        }, false);
    }

    /**
     * Load in a copy of the mesh that uses the picker shader
     * @param {string} filename Path to mesh file
     */
    loadMeshPickerTexture(filename) {
        let canvas = this;
        $.get("shaders/XYZ.vert", function(vertexSrc) {
            $.get("shaders/XYZ.frag", function(fragmentSrc) {
                // custom material
                let mat = new THREE.ShaderMaterial({
                    uniforms:{coord_choice:{value:2.0}},
                    vertexShader: vertexSrc,
                    fragmentShader: fragmentSrc
                });
                canvas.pickMat = mat;
                const objLoader = new OBJLoader();
                objLoader.load(filename, function(object) {      
                    object.traverse( function( child ) {
                        if (child.isMesh) {
                            child.material = mat;
                        }
                    });
                    canvas.pickerMesh = object;
                    centerOnBBox(object);
                    canvas.scene.add(object);
                    canvas.updateVisibility();
                    requestAnimationFrame(canvas.render.bind(canvas));
                });
            });
        });
    }

    /**
     * Asynchronously load the mesh geometry and the material for the mesh
     * 
     * @param {string} filename Path to the mesh geometry
     * @param {string} matfilename Path to the material file
     */
    loadMesh(filename, matfilename) {
        let canvas = this;
        // Step 1: Asynchronously load material with texture
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        
        mtlLoader.load(matfilename, (mtl) => {
            mtl.preload();
            objLoader.setMaterials(mtl);
            objLoader.load(filename, function(object) {       
                canvas.textureMesh = object;
                centerOnBBox(object);
                canvas.scene.add(object);
                canvas.loadMeshPickerTexture(filename);
                requestAnimationFrame(canvas.render.bind(canvas));
            });
        });

        
    }

    resizeRendererToDisplaySize() {
        const canvas = this.renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width  = canvas.clientWidth  * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // render animation
    render() {
        /*
        if (this.resizeRendererToDisplaySize()) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
        */

        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this)); // Keep the animation going
    }

    updateVisibility() {
        const canvas = this;
        this.textureMesh.traverse ( function (child) {
            if (child.isMesh) {
                child.visible = canvas.displayTexture;
            }
        });
        this.pickerMesh.traverse ( function (child) {
            if (child.isMesh) {
                child.visible = !canvas.displayTexture;
            }
        });
    }

    toggleTexture() {
        this.displayTexture = !this.displayTexture;
        this.updateVisibility();
    }

    toggleX() {
        this.displayTexture = false;
        this.pickMat.uniforms.coord_choice.value = 1;
        this.updateVisibility();
    }

    toggleY() {
        this.displayTexture = false;
        this.pickMat.uniforms.coord_choice.value = 2;
        this.updateVisibility();
    }

    toggleZ() {
        this.displayTexture = false;
        this.pickMat.uniforms.coord_choice.value = 3;
        this.updateVisibility();
    }

    /*
    const id =
    (pixelBuffer[0] <<  24) |
    (pixelBuffer[1] <<  16) |
    (pixelBuffer[2] <<   8);
    */

    addSphere(X, Y, Z){
        const geometry = new THREE.SphereGeometry( 10, 32, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        const sphere = new THREE.Mesh( geometry, material );
        
        this.scene.add( sphere );

        sphere.position.x = X;
        sphere.position.y = Y;
        sphere.position.z = Z;
    }
}

// location of the canvas
function getElementPosition() {
    obj = document.getElementById("threecanvas");
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

// location of mouse click
function getEventLocation(event){
    // Relies on the getElementPosition function.
    var pos = this.getElementPosition();
    
    return {
        x: (event.pageX - pos.x),
        y: (event.pageY - pos.y)
    };
}

function togTxt(){
    return this.toggleTexture();
}