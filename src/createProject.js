import { projectButtonEventHandler } from "./createProjectButton";
import { renderTodo, todoArray } from "./createTodo";
import { loadTodoButton, removeMainContentChildren } from "./init";
import { saveToLocalStorage } from "./localStorageHandler";
import { projectFactory, projectArray } from "./projectFactory";
import xlarge from "./img/x-lg.svg"

const createProject = (event) => {
  event.preventDefault();
  const createProjectInput = document.querySelector('#create-project')
  const projectName = createProjectInput.value;
  console.log(projectName)

  //prevent duplicate names
  const projectArrayLength = projectArray.length;
  const projectNameArray = []
  for (let i = 0; i < projectArrayLength; i++) {
    projectNameArray.push(projectArray[i].getName())
  }
  let projectNameExists = false;
  if (projectNameArray.indexOf(projectName) !== -1) {
    projectNameExists = true;
  }
  if (projectNameExists === false) {
    createProjectInput.classList.remove('create-project-exists-error')
    const project = projectFactory(projectName)
    console.log(project.getName())
    projectArray.push(project)
    projectNameArray.push(projectName)
    
    //save projects to local storage
    saveToLocalStorage('PROJECTS', projectNameArray)

    //renderProject
    renderProject(project)
  
    //remove form and create a new 'create project button'
    reloadCreateProjectButton();
  } else {
    console.log('Project names must be unique')
    createProjectInput.classList.add('create-project-exists-error')
  }
}

const reloadCreateProjectButton = () => {
  document.querySelector('#project-form').remove();
  const projectLinkList = document.querySelector('.project-list')
  const createNewProjectButton = document.createElement('button');
  createNewProjectButton.textContent = 'Create new project';
  createNewProjectButton.id = 'create-project-button';
  projectLinkList.appendChild(createNewProjectButton)
  projectButtonEventHandler();
}

const renderProject = (project) => {
  const projectContainer = document.createElement('div')
  projectContainer.classList.add('project-container')
  const projectName = project.getName()
  const projectValue = document.createElement('p')
  projectValue.textContent = projectName;
  projectValue.addEventListener('click', () => {
    filterProject(projectName)
  });
  projectContainer.appendChild(projectValue)

  //delete button
  if (projectName !== 'General') {
    const deleteProjectButton = document.createElement('img');
    deleteProjectButton.classList.add('delete-project-button')
    // deleteProjectButton.src = '../src/img/x-lg.svg'
    deleteProjectButton.src = xlarge;
    deleteProjectButton.addEventListener('click', () => {
      projectContainer.remove();
      project.deleteProject();
    })
    projectContainer.appendChild(deleteProjectButton)
  }
  document.querySelector('.project-list').appendChild(projectContainer)
}

const renderAllProjects = () => {
  const projectArrayLength = projectArray.length;
  for (let i = 0; i < projectArrayLength; i++) {
    renderProject(projectArray[i])
  }
}

const filterProject = (projectName) => {
  removeMainContentChildren();
  todoArray.forEach(todo => {
    if (todo.getProject() === projectName) {
      renderTodo(todo);
    }
  });
  loadTodoButton();
}

export {createProject, renderProject, filterProject, reloadCreateProjectButton, renderAllProjects}