const input = document.querySelector('input');
const audioElem = document.querySelector('audio');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;

    audioElem.src = URL.createObjectURL(file);
    audioElem.play();

    // Audio Processing
    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audioElem);
    const analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 512;
    const bufferDataLength = analyser.frequencyBinCount;
    const bufferDataArr = new Uint8Array(bufferDataLength);

    const gap = 2;
    const barWidthWithGap = ((canvas.width - (bufferDataLength - 1) * gap) / bufferDataLength) + 10;

    let x = 0;

    function drawAndAnimateSoundBars() {
        x = 0;

        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);


        analyser.getByteFrequencyData(bufferDataArr);

        bufferDataArr.forEach(dataValue => {
            // Calculate the dot height at the top of the bar
            const dotHeight = dataValue*2;

            // Apply the coloring condition
            if (dotHeight > 300) {
                 
                context.fillStyle = "red";
            } else if (dotHeight > 240) {

                context.fillStyle = "white";

            } else if (dotHeight > 100) {
                context.fillStyle = "blue";
            }
            else {
                context.fillStyle = "pink";
            }

            // Draw a dot at the top of the bar
            context.beginPath();
            context.arc(x + barWidthWithGap / 2, canvas.height - dotHeight, 6, 0, Math.PI * 2);
            context.fill();

            // Move to the next bar
            x += barWidthWithGap + gap + 5;
        });

        if (!audioElem.ended) requestAnimationFrame(drawAndAnimateSoundBars);
    }

    drawAndAnimateSoundBars();
});
