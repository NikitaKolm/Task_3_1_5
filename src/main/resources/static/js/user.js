$(async function () {
    await getFormForAuthUser()
})


const userFetchService = {
    getAuthUser: async () => await fetch('api/auth')
}

async function getFormForAuthUser() {
    let table = $('#userTable tbody');
    let navbar = $('#userNavbar div');
    let tab = $('#v-pills-tab');
    table.empty();
    navbar.empty();
    tab.empty();

    await userFetchService.getAuthUser()
        .then(res => res.json())
        .then(user => {
            let tableFilling = `$(
                        <tr id = "tr${user.id}">
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>     
                            <td>${user.email}</td>     
                            <td>${user.role}</td>     
                        </tr>
                )`;
            table.append(tableFilling);
            let navbarFilling = `$(
                                <a class="navbar-brand">${user.email} with roles: ${user.role}</a>
                                <button type="button" style="position: absolute; left: 94.5%; top: 6%;"
                                        onclick="window.location.href='/logout'"
                                        class="btn btn-dark">Logout
                                </button>
                )`;
            navbar.append(navbarFilling);
            if (user.role.includes("ADMIN")) {
                let navbarFilling = `
                                <button class="nav-link text-start" onclick="window.location.href='/admin/users'">Admin
                                </button>
                                <button class="nav-link active text-start" id="v-pills-home-tab" data-bs-toggle="pill"
                                        data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home"
                                        aria-selected="true">User
                                </button>
                                `;
                tab.append(navbarFilling)
            } else {
                let navbarFilling = `
                                <button class="nav-link active text-start" id="v-pills-home-tab" data-bs-toggle="pill"
                                        data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home"
                                        aria-selected="true">User
                                </button>
                                `;
                tab.append(navbarFilling)
            }
        })
}