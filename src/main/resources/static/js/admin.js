$(async function () {
    await getUsersTable();
    await getAuthUserNavbar();
    await eventListener();
    await getEditModal();
    await getDeleteModal();
    await addNewUser();
})


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUserById: async (id) => await fetch(`api/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    }),
    getAuthUser: async () => await fetch('api/auth')
}

async function getAuthUserNavbar() {
    let navbar = $('#adminNavbar div');
    navbar.empty();

    await userFetchService.getAuthUser()
        .then(res => res.json())
        .then(user => {
            let navbarFilling = `$(
                                <a class="navbar-brand">${user.email} with roles: ${user.role}</a>
                                <button type="button" style="position: absolute; left: 94.5%; top: 6%;"
                                        onclick="window.location.href='/logout'"
                                        class="btn btn-dark">Logout
                                </button>
                )`;
            navbar.append(navbarFilling);
        })
}

async function getUsersTable() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr id = "tr${user.id}">
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>     
                            <td>${user.email}</td>     
                            <td>${user.role}</td>     
                            <td>
                                <button type="button"  data-useridedit="${user.id}" data-action="edit" class="btn btn-info" 
                                data-toggle="modal" data-target="#editModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-useriddelete="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#deleteModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    eventListener();
}

async function getEditModal() {
    $('#editModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-useridedit');
        editUser(thisModal, userid);
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function getDeleteModal() {
    $('#deleteModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-useriddelete');
        deleteUser(thisModal, userid);
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function eventListener() {
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        if ($(event.target).attr('data-action') === "edit") {
            let editModal = $('#editModal');

            let targetButton = $(event.target);
            let editButtonUserId = targetButton.attr('data-useridedit');

            editModal.attr('data-useridedit', editButtonUserId);
            editModal.modal('show');
        } else if ($(event.target).attr('data-action') === "delete") {
            let deleteModal = $('#deleteModal');

            let targetButton = $(event.target);
            let deleteButtonUserId = targetButton.attr('data-useriddelete');

            deleteModal.attr('data-useriddelete', deleteButtonUserId);
            deleteModal.modal('show');
        }
    })
}

async function editUser(modal, id) {
    let currentUserData = await userFetchService.findOneUser(id);
    let user = currentUserData.json();

    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    let editButton = `<button type="button" id="editButtonModal" class="btn btn-primary">Edit</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm =
            `<form id="updateForm">
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>ID</h6>
                        <label for="ID" class="visually-hidden">ID</label>
                        <input type="text" class="form-control" name="ID"
                               id="ID"
                               placeholder="ID" value="${user.id}"
                               disabled
                               readonly>
                    </div>
                </div>
                </br>
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>First name</h6>
                        <label for="firstName" class="visually-hidden">First
                            name</label>
                        <input type="text" class="form-control" name="firstName"
                               id="firstName"
                               placeholder="First name" value="${user.firstName}">
                    </div>
                </div>
                </br>
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>Last name</h6>
                        <label for="lastName" class="visually-hidden">Last
                            name</label>
                        <input type="text" class="form-control" name="lastName"
                               id="lastName"
                               placeholder="Last name" value="${user.lastName}">
                    </div>
                </div>
            </br>
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>Age</h6>
                        <label for="age" class="visually-hidden">Age</label>
                        <input type="number" class="form-control" name="age"
                               id="age"
                               placeholder="Age" value="${user.age}">
                    </div>
                </div>
            </br>
                <div class="row justify-content-md-center">
                    <div class="col-6 has-validation">
                        <h6>Email</h6>
                        <label for="email" class="visually-hidden">Email</label>
                        <input type="email" class="form-control" name="email"
                               id="email"
                               placeholder="Email" value="${user.email}">
                    </div>
                </div>
            </br>
                <div class="row justify-content-md-center">
                    <div class="col-6 has-validation">
                        <h6>Password</h6>
                        <label for="password" class="visually-hidden">Password</label>
                        <input type="password" class="form-control" name="password"
                               id="password"
                               placeholder="Password">
                    </div>
                </div>
            </br>
                <div class="row justify-content-md-center">
                    <div class="col-6 has-validation">
                        <h6>Role</h6>
                        <select class="form-select" size="2"
                                aria-label="Size 2 select" id="roleSelect">
                            <option value="ROLE_ADMIN" id="selectAdmin">ADMIN</option>
                            <option value="ROLE_USER" id="selectUser">USER</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
        if (user.role === "ADMIN") {
            $('#roleSelect option[value="ROLE_ADMIN"]').prop('selected', true);
        } else if (user.role === "USER") {
            $('#roleSelect option[value="ROLE_USER"]').prop('selected', true);
        }
    })

    $("#editButtonModal").click(async () => {
        let id = modal.find('#ID').val().trim();
        let firstName = modal.find('#firstName').val().trim();
        let lastName = modal.find('#lastName').val().trim();
        let age = modal.find('#age').val().trim();
        let email = modal.find('#email').val().trim();
        let password = modal.find('#password').val().trim();
        let role = modal.find('#roleSelect option:selected').text();
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: [{
                name: "ROLE_" + role,
            }]
        };

        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            let tableFilling = `$(
                        <tr id = "tr${id}">
                            <td>${id}</td>
                            <td>${firstName}</td>
                            <td>${lastName}</td>
                            <td>${age}</td>     
                            <td>${email}</td>     
                            <td>${role}</td>     
                            <td>
                                <button type="button"  data-useridedit="${id}" data-action="edit" class="btn btn-info" 
                                data-toggle="modal" data-target="#editModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-useriddelete="${id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#deleteModal">Delete</button>
                            </td>
                        </tr>
            )`;
            $("#tr" + id).replaceWith(tableFilling);
            eventListener();
            modal.modal('hide');
        } else {
            let responseBody = await response.json();
            let alert = `</br>
                         <div class="alert alert-warning" role="alert" id="alert">
                            ${responseBody.info}
                            <button type="close" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                         </div>
                        `
            modal.find('.modal-body').append(alert)
        }
    })
}

async function deleteUser(modal, id) {
    let currentUserData = await userFetchService.findOneUser(id);
    let user = currentUserData.json();

    let deleteButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    let closeButton = `<button type="button" id="deleteButtonModal" class="btn btn-danger">Delete</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm =
            `<form id="deleteForm">
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>ID</h6>
                        <label for="ID" class="visually-hidden">ID</label>
                        <input type="text" class="form-control" name="ID"
                               id="IDD"
                               placeholder="ID" value="${user.id}"
                               disabled
                               readonly>
                    </div>
                </div>
                </br>
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>First name</h6>
                        <label for="firstName" class="visually-hidden">First
                            name</label>
                        <input type="text" class="form-control" name="firstName"
                               id="firstName"
                               placeholder="First name" value="${user.firstName}" disabled readonly>
                    </div>
                </div>
                </br>
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>Last name</h6>
                        <label for="lastName" class="visually-hidden">Last
                            name</label>
                        <input type="text" class="form-control" name="lastName"
                               id="lastName"
                               placeholder="Last name" value="${user.lastName}" disabled readonly>
                    </div>
                </div>
            </br>
                <div class="row justify-content-md-center">
                    <div class="col-6">
                        <h6>Age</h6>
                        <label for="age" class="visually-hidden">Age</label>
                        <input type="number" class="form-control" name="age"
                               id="age"
                               placeholder="Age" value="${user.age}" disabled readonly>
                    </div>
                </div>
            </br>
                <div class="row justify-content-md-center">
                    <div class="col-6 has-validation">
                        <h6>Email</h6>
                        <label for="email" class="visually-hidden">Email</label>
                        <input type="email" class="form-control" name="email"
                               id="email"
                               placeholder="Email" value="${user.email}" disabled readonly>
                    </div>
                </div>
            </br>
                <div class="row justify-content-md-center">
                    <div class="col-6 has-validation">
                        <h6>Role</h6>
                        <select class="form-select" size="2"
                                aria-label="Size 2 select" id="roleSelect">
                            <option value="ROLE_ADMIN" id="selectAdmin">ADMIN</option>
                            <option value="ROLE_USER" id="selectUser">USER</option>
                        </select>
                    </div>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm)
        if (user.role === "ADMIN") {
            $('#roleSelect option[value="ROLE_ADMIN"]').prop('selected', true);
        } else if (user.role === "USER") {
            $('#roleSelect option[value="ROLE_USER"]').prop('selected', true);
        }
    })

    $("#deleteButtonModal").click(async () => {
        const response = await userFetchService.deleteUserById(id);

        if (response.ok) {
            $("#tr" + id).remove();
            modal.modal('hide');
        }
    })
}


async function addNewUser() {
    $('#addButton').click(async () => {
        let addUserForm = $('#addForm')
        let firstName = addUserForm.find('#firstNameAdd').val().trim();
        let lastName = addUserForm.find('#lastNameAdd').val().trim();
        let age = addUserForm.find('#ageAdd').val().trim();
        let email = addUserForm.find('#emailAdd').val().trim();
        let password = addUserForm.find('#passwordAdd').val().trim();
        let role = addUserForm.find('#roleAdd option:selected').text();
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: [{
                name: "ROLE_" + role,
            }]
        };
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getUsersTable();
            addUserForm.find('#firstNameAdd').val('');
            addUserForm.find('#lastNameAdd').val('');
            addUserForm.find('#ageAdd').val('');
            addUserForm.find('#emailAdd').val('');
            addUserForm.find('#passwordAdd').val('');
            addUserForm.find('#roleAdd').val('USER');
            addUserForm.find('#alert').remove();
            setTimeout($("#nav-home-tab").click(), 1000);
        } else {
            let responseBody = await response.json();
            let alert = `<div class="alert alert-warning" role="alert" id="alert">
                            ${responseBody.info}
                            <button type="close" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
                            </button>
                         </div>
                        `
            addUserForm.prepend(alert)
        }
    })
}