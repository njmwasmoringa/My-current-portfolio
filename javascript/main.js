/* clientSide javascript */

const projectsContainer = document.getElementById('projects');
const skillsContainer = document.getElementById('skills-section');
const profilePic = document.getElementById('profile-picture');
const menuButton = document.querySelector('.main-menu-button');
const nav = document.querySelector('nav');
const initialHeaderHeight = Number(profilePic.offsetHeight);
const bodyWidth = document.body.offsetWidth;

/* window.addEventListener('scroll', function(){
    const top = document.body.scrollTop || document.documentElement.scrollTop;
    const newHeight = initialHeaderHeight - (initialHeaderHeight * (top / profilePic.offsetTop));
    console.log(newHeight)

    if (newHeight > 64) {
        profilePic.style.height = newHeight + 'px';
        profilePic.style.width = newHeight + 'px';
    }
    else{
        nav.parentNode.style.display = "flex";
        nav.parentNode.style.justifyContent = "space-between";
        nav.parentNode.style.border = "1px solid red";
        nav.parentNode.style.width = `calc(100% - ${profilePic.offsetWidth})`;
    }

    if (newHeight > 76) {
        nav.style.top = -(100 * (top / nav.offsetTop)) +'px';
        nav.style.left = ((nav.parentNode.parentNode.offsetWidth - nav.offsetWidth) * (top / nav.offsetTop)) +'px';
    }    
    else{
        nav.parentNode.style.display = "inline-block";
        nav.style.top = 'auto';
        nav.style.left = 'auto';
        nav.style.marginLeft = 'auto';
        nav.style.alignSelf = 'center';
    }

}); */

menuButton.addEventListener('click', () => {
    nav.style.display = nav.style.display == 'block' ? 'none' : 'block';
});

let numberOfProjectDisplayed = 3;
if (bodyWidth < 600) {
    numberOfProjectDisplayed = projects.length;
}

renderSkills();
renderProjects();
let animationInterval;
if (bodyWidth > 600) {
    animationInterval = setInterval(animateProjects, 5000);
}

function projectTemplate(item) {
    const template = document.getElementById('project-card-template');
    const templateClone = template.content.cloneNode(true);
    templateClone.querySelector('.project').style.background = `url(images/projects/${item.image}) center center`;
    templateClone.querySelector('.project').style.backgroundSize = "auto 100%"
    templateClone.querySelector('.title').innerText = item.title;
    templateClone.querySelector('.description').innerText = item.description;
    return templateClone;
}

function renderProjects() {
    projectsContainer.innerHTML = '';
    for (let i = 0; i < numberOfProjectDisplayed; i++) {
        const item = projects[i];
        projectsContainer.appendChild(projectTemplate(item));
    }
    projectsContainer.querySelectorAll('.button').forEach(function (button, i) {
        button.addEventListener('click', (evt) => {
            evt.preventDefault();
            const project = projects[i];
            openProject(project);
        });
    });
}

function openProject(project) {
    const template = document.getElementById('project-detail-modal');
    const templateClone = template.content.cloneNode(true);
    templateClone.querySelector('.project-title').innerText = project.title;
    templateClone.querySelector('.project-long-description').innerText = project.description;
    templateClone.querySelector('img').src = `images/projects/${project.image}`;
    templateClone.querySelector('.close').addEventListener('click', () => {
        document.getElementById('project-detail').remove();
    });
    templateClone.querySelector('.close');

    const screenshotContainer = templateClone.querySelector('.project-screenshots');
    screenshotContainer.innerHTML = '';
    project.screenshots.forEach((path) => {
        const img = document.createElement('img');
        img.src = `images/projects/${path}`;
        screenshotContainer.appendChild(img);
        // console.log(path);
    });
    document.body.appendChild(templateClone);
}

function animateProjects() {
    projectsContainer.appendChild(projectTemplate(projects[3]))
    const projectElements = projectsContainer.querySelectorAll('.project');
    projectElements.forEach(element => {
        element.animate(
            [
                { left: '0px' },
                { left: `-${element.offsetWidth + 20}px`, opacity: 1 }
            ],
            { duration: 3000 }
        )
    });
    setTimeout(() => {
        const firstItem = projects.shift();
        projects.push(firstItem);
        renderProjects()
    }, 3000);
}

function renderSkills() {
    const donutTemplate = document.querySelector('#donut-template');
    const skillsCategories = skills.reduce((a, b) => {
        if (!a[b.category]) {
            a[b.category] = {
                totalPacentage: 0,
                skills: []
            };
        }
        a[b.category].totalPacentage += b.level;
        a[b.category].skills.push(b);
        return a;
    }, {}),
        categories = Object.keys(skillsCategories);

    const categoriesContainers = skillsContainer.querySelector('#skills-categories');
    categoriesContainers.innerHTML = '';
    categories.forEach(category => {
        const donutChart = donutTemplate.content.cloneNode(true);
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        if (bodyWidth > 600) {
            categoryDiv.style.width = `${100 / categories.length}%`;
        }
        else{
            categoryDiv.style.width = `94vw`;
        }

        categoryDiv.appendChild(donutChart);
        const skillsDiv = document.createElement('div');
        skillsDiv.classList.add('skills');
        const texts = categoryDiv.querySelectorAll('text');
        skillsCategories[category].skills.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.classList.add('skill');
            skillDiv.innerHTML = `<span>${skill.name}</span> <span>${skill.level * 100}%</span>`;
            skillsDiv.appendChild(skillDiv);
        });
        categoryDiv.appendChild(skillsDiv);

        const pct = (skillsCategories[category].totalPacentage / skillsCategories[category].skills.length) * 100;
        categoryDiv.querySelector('.donut').setAttribute('data-pct', pct);
        texts[0].textContent = category;
        texts[1].textContent = `${Math.floor(pct)}%`;
        categoriesContainers.appendChild(categoryDiv);
    });

    donut();
}

function donut(val = 100) {
    document.querySelectorAll('.donut').forEach(donut => {
        val = donut.dataset.pct;
        const circle = donut.querySelector('.bar');
        let r = circle.getAttribute('r');
        console.log(r);
        let c = Math.PI * (r * 2);

        if (val < 0) { val = 0; }
        if (val > 100) { val = 100; }

        let pct = ((100 - val) / 100) * c;

        donut.style.strokeDashoffset = pct;
        circle.style.strokeDashoffset = pct;
    });
}