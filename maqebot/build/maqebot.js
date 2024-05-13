"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const parseCommands = (input) => {
    let position = { x: 0, y: 0, direction: 'North' };
    const directions = ['North', 'East', 'South', 'West'];
    let i = 0;
    while (i < input.length) {
        let command = input.charAt(i);
        switch (command) {
            case 'R':
                position.direction = directions[(directions.indexOf(position.direction) + 1) % 4];
                break;
            case 'L':
                position.direction = directions[(directions.indexOf(position.direction) + 3) % 4];
                break;
            case 'W':
                let numStart = i + 1;
                while (numStart < input.length && !isNaN(Number(input.charAt(numStart)))) {
                    numStart++;
                }
                const steps = parseInt(input.substring(i + 1, numStart));
                switch (position.direction) {
                    case 'North':
                        position.y += steps;
                        break;
                    case 'South':
                        position.y -= steps;
                        break;
                    case 'East':
                        position.x += steps;
                        break;
                    case 'West':
                        position.x -= steps;
                        break;
                }
                i = numStart - 1;
                break;
        }
        i++;
    }
    return position;
};
const main = () => {
    const filePath = path_1.default.join(__dirname, '..', 'commands.txt');
    const commands = fs_1.default.readFileSync(filePath, 'utf8').split(/\r?\n/);
    commands.forEach(command => {
        if (command.trim()) {
            const finalPosition = parseCommands(command);
            console.log(`Command: ${command}`);
            console.log(`Result: X: ${finalPosition.x} Y: ${finalPosition.y} Direction: ${finalPosition.direction}\n`);
        }
    });
};
main();
