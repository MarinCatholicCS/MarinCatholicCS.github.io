const textBeforeProjects = `$ whoami
Marin Catholic Computer Science Club\n
$ projects
`;

// append new projects here
const projects = [
    { name: "getmo", url: "../getmo/" },
    { name: "rate my teacher (beta)", url: "../ratemyteach/" }
];

const ozymandias = `I met a traveller from an antique land,
Who said—"Two vast and trunkless legs of stone
Stand in the desert. . . . Near them, on the sand,
Half sunk a shattered visage lies, whose frown,
And wrinkled lip, and sneer of cold command,
Tell that its sculptor well those passions read
Which yet survive, stamped on these lifeless things,
The hand that mocked them, and the heart that fed;
And on the pedestal, these words appear:
My name is Ozymandias, King of Kings;
Look on my Works, ye Mighty, and despair!"
Nothing beside remains. Round the decay
Of that colossal Wreck, boundless and bare
The lone and level sands stretch far away.`

const terminal = document.getElementById('terminal');
const cursor = document.createElement('span');
cursor.className = 'cursor';

let index = 0;
const typingSpeed = 60; // ms / character

function type() {
    if (index < textBeforeProjects.length) {
        terminal.textContent += textBeforeProjects.charAt(index);
        index++;
        setTimeout(type, typingSpeed);
    } else {
        addProjects();
    }
}

function addProjects() {
    let projectIndex = 0;
    
    function addNextProject() {
        if (projectIndex < projects.length) {
            const link = document.createElement('a');
            link.href = projects[projectIndex].url;
            link.textContent = `  ${projectIndex + 1}. ${projects[projectIndex].name}`;
            link.style.color = '#0f0';
            link.style.textDecoration = 'none';
            link.style.display = 'block';
            link.onmouseover = function() {
                this.style.textDecoration = 'underline';
            };
            link.onmouseout = function() {
                this.style.textDecoration = 'none';
            };
            
            terminal.appendChild(link);
            projectIndex++;
            setTimeout(addNextProject, 100);
        } else {
            const finalPrompt = document.createTextNode('\n$ ');
            terminal.appendChild(finalPrompt);
            terminal.appendChild(cursor);
            enableTyping();
        }
    }
    
    addNextProject();
}

function enableTyping() {
    const inputLine = document.createElement('span');
    inputLine.id = 'input-line';
    terminal.insertBefore(inputLine, cursor);
    
    document.addEventListener('keydown', function(e) {
        const currentText = inputLine.textContent;
        
        if (e.key === 'Backspace') {
            e.preventDefault();
            inputLine.textContent = currentText.slice(0, -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const command = currentText.trim();
            
            cursor.remove();
            
            const newLine = document.createTextNode('\n');
            terminal.appendChild(newLine);
            
            if (command) {
              let output;
              if (command == "sudo") {
                output = document.createTextNode(`sudo these nuts`);
              } else if (command == "whoami") {
                output = document.createTextNode(`who are we at all?`);
              } else if (command == "ozymandias") {
                output = document.createTextNode(ozymandias);
              } else {
                output = document.createTextNode(`${command}: command not found`);
              }
              const tempCommand = document.createTextNode(command);

              terminal.appendChild(command);
              terminal.appendChild(newLine);
              terminal.appendChild(output);
            }

            const newPrompt = document.createTextNode('$ ');
            terminal.appendChild(newPrompt);
            
            inputLine.textContent = '';
            
            terminal.insertBefore(cursor, null);
            terminal.insertBefore(inputLine, cursor);
            
        } else if (e.key.length === 1) {
            e.preventDefault();
            inputLine.textContent += e.key;
        }
    });
    
    window.focus();
}

window.addEventListener('load', () => {
    setTimeout(type, 500);
});