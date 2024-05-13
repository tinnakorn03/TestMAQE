document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 50;
    const arrowSize = 10;
    const origin = { x: canvas.width / 2, y: canvas.height / 2 }; 
    const arrowHeadSize = 5; 

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
    }

    function drawArrow(x, y, direction) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(direction * Math.PI / 2);
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -arrowSize);
        ctx.lineTo(-arrowHeadSize, -arrowSize + arrowHeadSize);
        ctx.moveTo(0, -arrowSize);
        ctx.lineTo(arrowHeadSize, -arrowSize + arrowHeadSize);
        ctx.fill(); 
        ctx.restore();
    }

    function animateMove(startX, startY, endX, endY, direction, callback) {
        const dx = endX - startX;
        const dy = endY - startY;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        let stepCount = 0;
        const stepSize = 2;
    
        function step() {
            const x = startX + (dx * stepCount * stepSize) / steps;
            const y = startY + (dy * stepCount * stepSize) / steps;
    
            const xClamped = Math.max(0, Math.min(x, canvas.width - arrowSize));
            const yClamped = Math.max(0, Math.min(y, canvas.height - arrowSize));
    
            drawGrid();
    
            const currentDirection = stepCount * stepSize >= steps ? direction : Math.atan2(dy, dx) / (Math.PI / 2);
            drawArrow(xClamped, yClamped, currentDirection+2); 
    
            if (stepCount * stepSize < steps) {
                stepCount++;
                requestAnimationFrame(step);
            } else {
                callback();
            }
        }
    
        requestAnimationFrame(step);
    }

    function parseAndDrawCommand(command) {
        let x = origin.x, y = origin.y;
        let direction = 0; // 0: N, 1: E, 2: S, 3: W
        const commands = command.match(/(R|L|W\d+)/g);

        function executeCommand(index) {
            if (index >= commands.length) {
                const directionNames = ['North', 'East', 'South', 'West'];
                const output = `X: ${x - origin.x} Y: ${origin.y - y} Direction: ${directionNames[direction]}`;
                alert(output);
                return;
            }

            const cmd = commands[index];
            if (cmd === 'R') {
                direction = (direction + 1) % 4;
                drawArrow(x, y, direction);
            } else if (cmd === 'L') {
                direction = (direction + 3) % 4;
                drawArrow(x, y, direction);
            } else if (cmd.startsWith('W')) {
                const steps = parseInt(cmd.slice(1), 10) * gridSize;
                let newX = x, newY = y;
                switch (direction) {
                    case 0: newY -= steps; break;
                    case 1: newX += steps; break;
                    case 2: newY += steps; break;
                    case 3: newX -= steps; break;
                }

                newX = Math.max(0, Math.min(newX, canvas.width - arrowSize));
                newY = Math.max(0, Math.min(newY, canvas.height - arrowSize));

                animateMove(x, y, newX, newY, direction, () => {
                    x = newX;
                    y = newY;
                    executeCommand(index + 1);
                });
                return;
            }
            executeCommand(index + 1);
        }

        executeCommand(0);
    }
    // function parseAndDrawCommand(command) {
    //     let x = origin.x, y = origin.y;
    //     let direction = 0; // 0: N, 1: E, 2: S, 3: W
    //     const commands = command.match(/(R|L|W\d+)/g);

    //     function executeCommand(index) {
    //         if (index >= commands.length) {
    //             return; // End simulation if all commands are executed
    //         }

    //         const cmd = commands[index];
    //         if (cmd === 'R') {
    //             direction = (direction + 1) % 4;
    //             drawArrow(x, y, direction); // Draw with the new direction
    //         } else if (cmd === 'L') {
    //             direction = (direction + 3) % 4;
    //             drawArrow(x, y, direction); // Draw with the new direction
    //         } else if (cmd.startsWith('W')) {
    //             const steps = parseInt(cmd.slice(1), 10) * gridSize;
    //             const dx = direction === 1 ? steps : direction === 3 ? -steps : 0;
    //             const dy = direction === 0 ? -steps : direction === 2 ? steps : 0;

    //             const newX = Math.max(0, Math.min(x + dx, canvas.width - maxArrowSize));
    //             const newY = Math.max(0, Math.min(y + dy, canvas.height - maxArrowSize));

    //             animateMove(x, y, newX, newY, direction, () => {
    //                 x = newX;
    //                 y = newY;
    //                 executeCommand(index + 1);
    //             });

    //             return; // Wait for animation to finish
    //         }
    //         drawArrow(x, y, direction); // Draw after each command
    //         executeCommand(index + 1); // Move to next command
    //     }

    //     executeCommand(0);
    // }

    function runSimulation() {
        console.log('Button clicked!')
        const command = document.getElementById('commandInput').value;
        parseAndDrawCommand(command);
    }

    window.runSimulation = runSimulation;
    drawGrid();
});
