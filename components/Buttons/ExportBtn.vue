<template>
    <button type="button" id="exportBtn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exportModal">
        <font-awesome-icon :icon="['fas', 'file-export']" />
        Export 
    </button>
</template>

<script>
    export default {
        name: "ExportBtn",

    }
</script>
