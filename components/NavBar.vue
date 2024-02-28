<template>
    <nav class="navbar navbar-expand-lg navbar-dark " id="topNav">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">chessInsights.xyz</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav ">
                <li class="nav-item">
                <router-link class="nav-link" to="/about#donations" target="_blank">Donations</router-link>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="https://github.com/NotJoeMartinez/chess-insights" target="_blank">Source Code</a>
                </li>
                <li class="nav-item">
                <NuxtLink class="nav-link" to="/about">How to use this site</NuxtLink>
                </li>

            </ul>
            </div>
        </div>
    </nav>
    
</template>

<script>
export default {
    name: 'NavBar',
}

</script>