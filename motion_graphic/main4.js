function startPattern4(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    let analyser;
    let dataArray;
    let audioStream;

    const objects = [];
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );

    for(let i = 0; i < 32; i++) {
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.x = (i - 16) * 1.5;
        scene.add( cube );
        objects.push(cube);
    }

    camera.position.z = 20;

    const listener = new THREE.AudioListener();
    camera.add( listener );
    const audio = new THREE.Audio( listener );

    navigator.mediaDevices.getUserMedia( { audio: true, video: false } ).then( handleSuccess ).catch(handleError);

    function handleSuccess( stream ) {
        audioStream = stream;
        const source = audio.context.createMediaStreamSource( stream );
        audio.setMediaStreamSource(source);
        analyser = new THREE.AudioAnalyser( audio, 64 );
    }
    
    function handleError(error) {
        console.error('Error accessing microphone:', error);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'マイクへのアクセスが拒否されました。オーディオビジュアライザは機能しません。';
        errorDiv.style.color = 'red';
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '10px';
        errorDiv.style.left = '10px';
        errorDiv.style.zIndex = '100';
        container.appendChild(errorDiv);
    }

    let animationId;
    function animate() {
        animationId = requestAnimationFrame( animate );
        if(analyser) {
            dataArray = analyser.getFrequencyData();
            for(let i = 0; i < objects.length; i++) {
                const scale = dataArray[i] / 16;
                objects[i].scale.y = scale > 1 ? scale : 1;
                const color = new THREE.Color();
                color.setHSL(i / objects.length, 1.0, 0.5);
                objects[i].material.color = color;
            }
        }
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
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
        }
        if (audio.isPlaying) audio.stop();
        listener.context.close();
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeListener);
        geometry.dispose();
        objects.forEach(o => o.material.dispose());
        renderer.dispose();
    };
}