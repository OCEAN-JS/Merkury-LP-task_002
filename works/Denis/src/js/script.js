document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.querySelector('.drop__zone');
  let movingElement;

  const countTasks = () => {
    const inProgressBlock = document.getElementById('inProgress');
    const completedBlock = document.getElementById('completed');
    const inProgressNode = document.getElementById('tasksInProgressNumber');
    const completedNode = document.getElementById('completedTasksNumber');
    inProgressNode.textContent = `(${inProgressBlock.querySelectorAll('.task').length})`;
    completedNode.textContent = `(${completedBlock.querySelectorAll('.task').length})`;
  };

  countTasks();

  const dragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
  };

  const dragDrop = (event) => {
    event.currentTarget.parentNode.appendChild(movingElement);
    countTasks();
  };

  const dragEnd = () => {
    dropZone.removeEventListener('drop', dragDrop);
    dropZone.classList.remove('drop__zone-visible');
  };

  const dragStart = (event) => {
    movingElement = event.currentTarget;
    event.dataTransfer.effectAllowed = 'move';
    dropZone.classList.add('drop__zone-visible');
    let oppositeArea;
    if (event.currentTarget.parentNode.id === 'inProgress') {
      oppositeArea = event.currentTarget.parentNode.parentNode.querySelector('#completed');
    } else {
      oppositeArea = event.currentTarget.parentNode.parentNode.querySelector('#inProgress');
    }
    oppositeArea.appendChild(dropZone);
    dropZone.addEventListener('dragover', dragOver);
    dropZone.addEventListener('drop', dragDrop);
  };

  (() => {
    const draggableElements = [...document.querySelectorAll('.task')];
    draggableElements.forEach(el => el.addEventListener('dragstart', dragStart));
    draggableElements.forEach(el => el.addEventListener('dragend', dragEnd));
  })();
});
