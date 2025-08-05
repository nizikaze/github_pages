function startPattern1(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    const particles = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array( particles * 3 );

    for ( let i = 0; i < positions.length; i += 3 ) {
        positions[i] = ( Math.random() - 0.5 ) * 10;
        positions[i+1] = ( Math.random() - 0.5 ) * 10;
        positions[i+2] = ( Math.random() - 0.5 ) * 10;
    }

    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

    const material = new THREE.PointsMaterial( { 
        color: 0xffffff, 
        size: 0.02,
        transparent: true,
        blending: THREE.AdditiveBlending
    } );

    const points = new THREE.Points( geometry, material );
    scene.add( points );

    camera.position.z = 5;

    let animationId;
    function animate() {
        animationId = requestAnimationFrame( animate );
        const time = Date.now() * 0.0005;
        points.rotation.x = time * 0.25;
        points.rotation.y = time * 0.5;
        const positions = geometry.attributes.position.array;
        for ( let i = 0; i < positions.length; i += 3 ) {
            const x = positions[i];
            const y = positions[i+1];
            const z = positions[i+2];
            positions[i] = x + (Math.sin(time + x) * 0.01);
            positions[i+1] = y + (Math.cos(time + y) * 0.01);
            positions[i+2] = z + (Math.sin(time + z) * 0.01);
        }
        geometry.attributes.position.needsUpdate = true;
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