// https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html
// https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
// https://threejs.org/docs/#api/en/core/BufferGeometry 
// https://discourse.threejs.org/t/solved-geometry-vertices-is-undefined/3133
// https://stackoverflow.com/questions/59949791/how-to-get-vertices-of-obj-model-object-in-three-js
// https://www.howtobuildsoftware.com/index.php/how-do/b2Qd/javascript-threejs-how-to-access-the-vertices-after-loading-object-with-objloader-in-threejs

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
        let canvas = document.querySelector('#c');
        let scene = new THREE.Scene();
        scene.background = new THREE.Color('gray');
        this.canvas = canvas;
        this.scene = scene;

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

        const mtlLoader = new MTLLoader();
        // Step 2: Asynchronously load in mesh geometry 
        const objLoader = new OBJLoader();

        this.loadShaders();
    }

    loadShaders() {
        const canvas = this;
        this.coordShaderMatPromise = new Promise(function(resolve) {
            $.get("shaders/X.vert", function(vertexSrc) {
                $.get("shaders/X.frag", function(fragmentSrc) {
                    // custom material
                    let mat = new THREE.ShaderMaterial({
                        uniforms:{},
                        vertexShader: vertexSrc,
                        fragmentShader: fragmentSrc
                    });
                    canvas.coordShaderMat = mat;
                    resolve(mat);
                });
            });
        });
        this.coordShaderMat = null;
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
                centerOnBBox(object);
                canvas.scene.add(object);
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
        if (this.resizeRendererToDisplaySize()) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }

        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this)); // Keep the animation going
    }

    /*
    const id =
    (pixelBuffer[0] <<  24) |
    (pixelBuffer[1] <<  16) |
    (pixelBuffer[2] <<   8);
    */

                     

}