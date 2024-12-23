function submitNewMedic() {
    let data = {
        lastname: document.getElementById('lastname').value,
        firstname: document.getElementById('firstname').value,
        id: document.getElementById('id').value,
        password: document.getElementById('password').value
    };

    fetch('/medicauth', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error('Error:', err));
}
