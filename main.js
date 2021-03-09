// https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html
// https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
// https://threejs.org/docs/#api/en/core/BufferGeometry 
// https://discourse.threejs.org/t/solved-geometry-vertices-is-undefined/3133
// https://stackoverflow.com/questions/59949791/how-to-get-vertices-of-obj-model-object-in-three-js
// https://www.howtobuildsoftware.com/index.php/how-do/b2Qd/javascript-threejs-how-to-access-the-vertices-after-loading-object-with-objloader-in-threejs

// make vertex shader for smoke stack
// load an invisible smokestack
// use vertex shader on invisible smokestack
// use buffer geometry to be able to index all of the vertecies by color
// use picking to know what vertex was clicked

// center the model
// fix github
function main(){
    const vertecies = 85566;
    const faces = 170118;

    let 
        canvas,
        scene,
        camera,
        renderer,
        controls,
        objLoader,
        mtlLoader;

    canvas = document.querySelector('#c');

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');

    // camera
    const fov = 75;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(
        fov,
        aspect,
        near,
        far
    );
    camera.position.z = 50;

    // renderer
    renderer = new THREE.WebGLRenderer( {canvas} ); // antiailiasing is off by default. https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); 

    // lighting
    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add(ambient);

    // orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true;
    controls.campingFactor = 0.25;
    controls.enableZoom = true;

    // smoke stack model
    objLoader = new OBJLoader();
    mtlLoader = new MTLLoader();

    // model for viewing
    /*
    mtlLoader.load('models/smokeStack/surface.mtl', (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load('models/smokeStack/surface.obj', (object) => {
            scene.add(object);
            //note: 3js is allergic to meshlab exports
            object.rotation.x += 2.5;
        });
    });
    */

    function resizeRendererToDisplaySize(renderer) {

        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width  = canvas.clientWidth  * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;

        if (needResize) {
            renderer.setSize(width, height, false);
        }

        return needResize;
    }

    // render animation
    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        controls.update();

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    // promises for the shader
    $.get("shaders/vertexShader.vert", function(vertexSrc) {
        $.get("shaders/fragmentShader.frag", function(fragmentSrc) {

            // custom material
            let mat = new THREE.ShaderMaterial({
                uniforms:{},
                vertexShader: vertexSrc,
                fragmentShader: fragmentSrc
            });

            // load the obj model
            objLoader.load('../../models/smokeStack/surface.obj', (object) => {
                
                const geometry = new THREE.BufferGeometry();
                // const vertexID = new Float32Array(vertecies);
                // geometry.setAttribute('vertexID', new THREE.BufferAttribute( vertexID, 1 ));
                
                // bounding box
                let box = new THREE.Box3().setFromObject(object);

                // dimensions of the bounding box
                let dimensions = new THREE.Vector3();
                box.getSize(dimensions);

                // set the material of the object to mat
                let i = 0;
                object.traverse( function( child ) {
                    if ( child.isMesh ) {
                        child.material = mat;

                        let pos = child.geometry.attributes.position.array;

                        if (i >= 0){
                            if (i = 0){
                                
                                console.log(pos);
                                
                            }
                            else{
                                pos = new Float32Array(child.geometry.attributes.position.array.length);
                                console.log(pos);
                            }
                        }

                        geometry.setAttribute(child.uuid, new THREE.BufferAttribute( pos, 3 ));

                        i++;

                        // let v = new THREE.Vector3( pos.getX(0), pos.getY(0), pos.getZ(0) );
                        // console.log(v);

                        // console.log(child.geometry.attributes.position.array);
                    }
                });

                console.log(geometry);

                // center the model
                let boxCenter = box.getCenter(new THREE.Vector3());
                object.position.x += boxCenter.x;
                object.position.y += boxCenter.y;
                object.position.z += boxCenter.z;
        
                // set model upright
                object.rotation.x += 2.5;
                scene.add(object);

                requestAnimationFrame(render);

                /*
                const id =
                (pixelBuffer[0] <<  24) |
                (pixelBuffer[1] <<  16) |
                (pixelBuffer[2] <<   8);
                */
            });            
        });
    });
}
main();













