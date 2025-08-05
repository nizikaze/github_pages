function startPattern2(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    const particles = 20000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array( particles * 3 );
    const colors = new Float32Array( particles * 3 );
    const colorInside = new THREE.Color(0xff4444);
    const colorOutside = new THREE.Color(0x1133ff);

    for ( let i = 0; i < particles; i++ ) {
        const i3 = i * 3;
        const radius = Math.random() * 5;
        const spinAngle = radius * 3;
        const branchAngle = (i % 3) / 3 * Math.PI * 2;
        const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / 5);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

    const material = new THREE.PointsMaterial({ 
        size: 0.02, 
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });

    const points = new THREE.Points( geometry, material );
    scene.add( points );
    camera.position.z = 7;
    const clock = new THREE.Clock();

    let animationId;
    function animate() {
        animationId = requestAnimationFrame( animate );
        const elapsedTime = clock.getElapsedTime();
        points.rotation.y = elapsedTime * 0.1;
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
        material.dispose();
        renderer.dispose();
    };
}