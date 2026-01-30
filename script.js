const textIntro = `$ whoami
Marin Catholic Computer Science Club

$ projects
`;

// append new projects here
const projects = [
    { name: "getmo", url: "../getmo/" },
    { name: "rate my teacher (beta)", url: "../ratemyteach/" }
];

const officers = [
    { name: "Stanley Ho — Co-President" },
    { name: "Nico Zametto — Co-President" },
    { name: "Alex Willard — Officer" },
    { name: "Mo Adib - Moderator" }

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

const mc_ascii = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
%@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%@%%%@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@@@%%%%%%
%@%%%@@                                         @%                                           %%%%%%%
%@%%%%@                                       @%@%%@                                         %%%%%%%
%@%%%%@                                      @%%%%%@@                                        %%%%%%%
%@%%%%@                                    %%%%%%%%%%@%@                                     %%%%%%%
%@%%%%@                                   @@@@@%%%@%@@%@                                     @%%%%%%
%@%%%%@                                       @@%%@@                                         @%%%%%%
%@%%%%@                              @@       @@%%@@       @@                                @%%%%%%
%@%%%%@                             @@%@      %@%%@@      @%%@@                              @%%%%%%
%@%%%%@                           @%@%@%@@@@@@@%%%@@@@@@@@@@%@%%                             @%%%%%%
%@%%%%@                         @%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@%@                           @%%%%%%
%@%%%%@                         @@%%%%%%%%%%%@@@%%@@%%%%%%%%%%%@@@                           @%%%%%%
%@%%%%@                           @@%%%%      @%%%%%      @@%%%@                             @%%%%%%
%@%%%%@        %@@@@@@@@@@@@@@@%    @%%@      @@%%@@      @@%%    %@@@@@@@@@@@@@@@@@         @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%@   @@       @@%%@@       @@   @%@%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%%           @@%%@@           %%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%@@      @@@@@@%%@%@@%%      @%%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%%%@      %@@@%%%%%%@%      @%%%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%%%%%@      @@%%%%%@       @@%%%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @@%%%%%%%%%%%%%%%%%%%%%%%@       %%%%@       @@%%%%%%%%%%%%%%%%%%%%%%%@        @%%%%%%
%@%%%%@           %%%%%%%%%%@%%%%%%%%%@%@                 @@%%%%%%%%%%@@%%%%%%%%@@           @%%%%%%
%@%%%%@           @%%%%%%%%%%@@%%%%%%%%%%@               @@%%%%%%%%%@@%%%%%%%%%%%@           @%%%%%%
%@%%%%@           @%%%%%%%%%@@ @%%%%%%%%%%@             %%%%%%%%%%%@@@%@%%%%%%%%%@           @%%%%%%
%@%%%%@           @%%%%%%%%%%@  @%%%%%%%%@@@           @%@%%%%%%%%%@ @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           @%%%%%%%%%%@   %%%%%%%%%%@@         @@@%@@%%%%%@   @%@%%%%%%%%%@           @%%%%%%
%@%%%%@           @%%%%%%%%%%@    @%%%%%%%%%@@@@@%%%%%%@@@%@@%@%@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           @%%%%%%%%%%@     @%@%%%%%%%@@@@%%%%%%%%%%%%%@@     @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           @%%%%%%%%%%@      @@@%%%%%%%%@@@%%%%%%%%%%%%@@@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @@@%%%%%%%%%@@@%%%%%%%%%%%%@@@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%@@%@%%%%%%%@@@@%%%%%%%%%%@%@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%@@@%%%%%%%%@@@@@@@@%%%%%@%@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%%@@@@%%%%%%%%@   %@%%%%%@%@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%%%%@@%%%%%%%%@%  @@%%%%%@%@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%%%@@@%@%%%%%%%@@@@@%%%%%@%@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%@@     @%%%%%%@@%%%%%%%%%%@@@@@@@@@@@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%@@     @%%%%%%@@ @%%%%%%%@               @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           @@%%%%%%%%@%     @%%%%%%@@  @%%%%@@                %@@%%%%%%%%@@           @%%%%%@
%@%%%@@          @@@%%%%%%%%%%     @%%%%%%@@   @@%@                  @%@%%%%%%%%%@           @%%%%%@
%@%%%%@       @%@@%@%%%%%%%%@%@%%  @%%%%%%@@    @@                 %@%@%%%%%%%%%@%@@@@      @%%%%%%@
@@%%%@@       @%%%%%%%%%%%%%%%%%%  @%%%%%%@@                       %@%%%%%%%%%%%%%%%%@      @@%%%%%@
%%%%%%@@      @%%%%%%%%%%%%%%%%%%  @@%%%%%@@                       %@%%%%%%%%%%%%%%%%@     @@%%%%@% 
%@@%%%%@@     @%%%%%%%%%%%%%%%%%%  @@%%%%%@@                       %@%%%%%%%%%%%%%%%%@    @%%%%%@@@ 
 @@%%%%@@@    @%%%%%%%%%%%%%%%%%%  @@%%%%%@@                       %@%%%%%%%%%%%%%%%%@   @@%%%%%%@  
  %@%%%%%%%   @@@%%%%%%%%%%%%%%%@  @@%%%%%@@            @@@@@@@@   %@@%%%%%%%%%%%%@%@   %@%%%%%%@   
   @%@%%%%%@@                      @@%%%%%@@           @%%%%%%%%@                      %@%%%%%@%@   
    @%%%%%%%%@                     @@%%%%%@@           @@%%%%%@%@                    @@@%%%%@@@     
     @%@%%%%%%@@                   @@%%%%%@@           @@%%%%%@%@                   @%%%%%%@%@      
       @@%%%%%@%%@                 @@%%%%%%@           @%%%%%%@%@                 @%@%%%%%%%        
        @@@%%%%%@@@@               @@%%%%%@@@@@@@@@@@@@@%%%%%%@@@               @@%%%%%%%@@         
          @%@%%%%%%@@@             @%%%%%%%%%%%%%%%%%%%%%%%%%%%%              @%%%%%%%%%@           
            @@@%%%%%%@@@           @@@%%%%%%%%%%%%%%%%%%%%%%%@@%           @@%@%%%%%%%@             
              @%%@%%%%%@@@          @@%@@@@@@@@@@@@@@@@@@@@@%%@          @%%%%%%%%@@@               
                @%%%%%%%%@%@%         @@@@@@@@@@@@@@@@@@@@@%@          @@@@%%%%%%%@                 
                  @@%%%%%%%@%%@@                                    @@@%%%%%%%@@@@                  
                    @%@%%%%%%%@@@@@                              @%%@%%%%%%%@@@                     
                       @@%@%%%%%%%%@@@                        @@%%%%%%%%%@@%@                       
                          @%%@%%%%%%%%%@                    %@%%%%%%%%@@@@                          
                            @%@%%%%%%%%%%@@%             @@%@%%%%%%%%@@@                            
                               @@%@%%%%%%%%%@@@      %@%@%%%%%%%%%@@@                               
                                  @@@%%%%%%%%%%%%@@@%%%%%%%%%%%@@@                                  
                                     @@%@@%%%%%%%%%%%%%%%%@@%@@                                     
                                         @%@%%%%%%%%%%%%%%%%                                        
                                           @@%%%%%%%%@%@@                                           
                                              @@@%%@@@        `

const terminal = document.getElementById('terminal');
const cursor = document.createElement('span');
cursor.className = 'cursor';

let index = 0;
const typingSpeed = 30;
let currentInputLine = null;

function typeIntro() {
    if (index < textIntro.length) {
        terminal.textContent += textIntro.charAt(index++);
        setTimeout(typeIntro, typingSpeed);
    } else {
        addProjects();
    }
}

function cmd_handler(command) {
    let outputText;
    if (command === "sudo") {
        outputText = "sudo these nuts";
    } else if (command === "whoami") {
        outputText = "who are we at all?";
    } else if (command === "ozymandias") {
        outputText = ozymandias;
    } else if (command === "gavin") {
        outputText = "newsom🥀💔";
    } else if (command === "mc") {
        outputText = mc_ascii;
    } else if (command === "1") {
        window.location.replace(projects[0].url);
    } else if (command === "2") {
        window.location.replace(projects[1].url);
    } else {
        outputText = `${command}: command not found`;
    }
    return outputText;
}

function addProjects() {
    let i = 0;

    function next() {
        if (i < projects.length) {
            const link = document.createElement("a");
            link.href = projects[i].url;
            link.textContent = `  ${i + 1}. ${projects[i].name}`;
            link.style.display = "block";
            link.style.color = "#00ff1eff";          // white
            link.style.textDecoration = "none";
            link.onmouseover = () => link.style.textDecoration = "underline";
            link.onmouseout = () => link.style.textDecoration = "none";

            terminal.appendChild(link);

            i++;
            setTimeout(next, 120);
        } else {
            terminal.appendChild(document.createTextNode("\n$ officers\n"));
            addOfficers();
        }
    }

    next();
}


function addOfficers() {
    let i = 0;

    function next() {
        if (i < officers.length) {
            const line = document.createElement("div");
            line.textContent = `  - ${officers[i].name}`;
            line.style.color = "#00ff1eff";          // white
            line.onmouseover = () => line.style.textDecoration = "underline";
            line.onmouseout = () => line.style.textDecoration = "none";
            terminal.appendChild(line);

            i++;
            setTimeout(next, 120);
        } else {
            terminal.appendChild(document.createTextNode("\n$ "));
            terminal.appendChild(cursor);
            enableTyping();
        }
    }

    next();
}

function enableTyping() {
    currentInputLine = document.createElement('span');
    currentInputLine.className = 'input-line';
    terminal.insertBefore(currentInputLine, cursor);

    document.addEventListener('keydown', function handleKeyPress(e) {
        if (!currentInputLine) return;

        const currentText = currentInputLine.textContent;

        if (e.key === 'Backspace') {
            e.preventDefault();
            currentInputLine.textContent = currentText.slice(0, -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const command = currentText.trim();

            const commandEcho = document.createTextNode(command);
            const lineBreak1 = document.createElement("br");

            terminal.insertBefore(commandEcho, cursor);
            terminal.insertBefore(lineBreak1, cursor);

            if (command) {
                const outputText = cmd_handler(command);

                const output = document.createTextNode(outputText);
                const lineBreak2 = document.createElement("br");

                terminal.insertBefore(output, cursor);
                terminal.insertBefore(lineBreak2, cursor);
            }

            const newPrompt = document.createTextNode('$ ');
            terminal.insertBefore(newPrompt, cursor);

            if (currentInputLine && currentInputLine.parentNode) {
                currentInputLine.remove();
            }

            currentInputLine = document.createElement('span');
            currentInputLine.className = 'input-line';
            terminal.insertBefore(currentInputLine, cursor);

            terminal.scrollTop = terminal.scrollHeight;

        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            currentInputLine.textContent += e.key;
        }
    });

    window.focus();
}

window.addEventListener("load", () => {
    setTimeout(typeIntro, 500);
});
