const textBeforeProjects = `$ who am i
Marin Catholic Computer Science Club

$ projects
`;

        // append new projects here
        const projects = [
            { name: "getmo", url: "../getmo/" },
            { name: "rate my teacher", url: "../ratemyteach/" }
        ];

        const terminal = document.getElementById('terminal');
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        
        let index = 0;
        const typingSpeed = 30; // ms / charcater

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
                    link.textContent = '  ${projectIndex + 1}. ${projects[projectIndex].name}';
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
                }
            }
            
            addNextProject();
        }

        window.addEventListener('load', () => {
            setTimeout(type, 500);
        });