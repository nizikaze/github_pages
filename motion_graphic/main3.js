function startPattern3(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild( renderer.domElement );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const objects = [];
    const geometry = new THREE.IcosahedronGeometry(0.5, 0);
    for(let i = 0; i < 50; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            metalness: 0.7,
            roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        const scale = Math.random() * 0.5 + 0.2;
        mesh.scale.set(scale, scale, scale);
        objects.push(mesh);
        scene.add(mesh);
    }

    camera.position.z = 8;
    const clock = new THREE.Clock();

    let animationId;
    function animate() {
        animationId = requestAnimationFrame( animate );
        const elapsedTime = clock.getElapsedTime();
        for(const object of objects) {
            object.rotation.y += 0.005;
        }
        camera.position.x = Math.sin(elapsedTime * 0.1) * 8;
        camera.position.z = Math.cos(elapsedTime * 0.1) * 8;
        camera.lookAt(new THREE.Vector3(0,0,0));
        renderer.render( scene, camera );
    }
    animate();

    const resizeListener = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resizeListener);

    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeListener);
        geometry.dispose();
        objects.forEach(o => o.material.dispose());
        renderer.dispose();
    };
}