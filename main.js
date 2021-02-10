// https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html
// https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
// https://threejs.org/docs/#api/en/core/BufferGeometry 
// https://discourse.threejs.org/t/solved-geometry-vertices-is-undefined/3133
// ask ryan about picking

// make vertex shader for smoke stack
// load an invisible smokestack
// use vertex shader on invisible smokestack
// use buffer geometry to be able to index all of the vertecies by color
// use picking to know what vertex was clicked

// center the model
// fix github
function main(){
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
    renderer = new THREE.WebGLRenderer( {canvas} ); 
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

    /*
    let mat = new THREE.ShaderMaterial({
        uniforms:{},
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent
    });
    */
    
    let mat = new THREE.MeshNormalMaterial();

    // model for picking
    //objLoader.setMaterials(mat);
    objLoader.load('models/smokeStack/surface.obj', (object) => {
        object.traverse( function( child ) {
            if ( child.isMesh ) {
                child.material = mat;
            }
        });
        let box = new THREE.Box3().setFromObject(object);
        let boxCenter = box.getCenter(new THREE.Vector3());

        object.position.x += boxCenter.x;
        object.position.y += boxCenter.y;
        object.position.z += boxCenter.z;

        object.rotation.x += 2.5;
        scene.add(object);
    });

    // canvas resizing
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
    
    requestAnimationFrame(render);

}
main();














