function toggleCheckbox(event) {
    const target = event.target;
    if (target.tagName === 'LABEL') {
        return;
    }

    let checkbox;
    if (target.tagName === 'INPUT') {
        checkbox = target;
    } else {
        checkbox = target.closest('.doodle-container').querySelector('.doodle-input');
    }

    checkbox.checked = !checkbox.checked;
    event.preventDefault();
}