<template>
      <button 
      type="button" 
      id="clearBtn" 
      class="btn btn-danger"
        @click="clearLocalStorage()"
      >
       Clear 
      </button>
  </template>
  
<script>
import { clearLocalStorage } from '~/utils/utils.js'
export default {
    name: 'ExploreBtn',
    methods: {
        clearLocalStorage() {
            clearLocalStorage()
            window.location.reload()
        }
    }

};
</script>
  
<style>
#clearBtn {
    border: none;
    font-weight: bold;
    margin-right: 10px;
}

</style>