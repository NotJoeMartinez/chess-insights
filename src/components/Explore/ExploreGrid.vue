<template>
 
    <div class="table-responsive">

        <table v-if="filteredData.length" class="table ">
            <thead>
                <tr>
                    <th v-for="(key, index) in columns" :key="'header-' + index" @click="sortBy(key)"
                        :class="{ active: sortKey == key }">
                        {{ capitalize(key) }}
                        <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(entry, rowIndex) in filteredData" :key="'row-' + rowIndex">
                    <td v-for="(key, colIndex) in columns" :key="'cell-' + rowIndex + '-' + colIndex">
                        {{ entry[key] }}
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-else>No matches found.</p>
    </div>
</template>



<script>
    export default {
        name: 'ExploreGrid',
        props: {
            gridData: Array,
            columns: Array,
            filterKey: String
        },
        data() {
            return {
                sortKey: '',
                sortOrders: this.columns.reduce((o, key) => ((o[key] = 1), o), {})
            }
        },
        created(){
            console.log(this.columns)
            console.log('Received data:', this.gridData);
        },
        computed: {
            filteredData() {
                const sortKey = this.sortKey
                const filterKey = this.filterKey && this.filterKey.toLowerCase()
                const order = this.sortOrders[sortKey] || 1
                let data = this.data
                if (filterKey) {
                    data = data.filter((row) => {
                        return Object.keys(row).some((key) => {
                            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                        })
                    })
                }
                if (sortKey) {
                    data = data.slice().sort((a, b) => {
                        a = a[sortKey]
                        b = b[sortKey]
                        return (a === b ? 0 : a > b ? 1 : -1) * order
                    })
                }
                return data
            }
        },
        methods: {
            sortBy(key) {
                this.sortKey = key
                this.sortOrders[key] = this.sortOrders[key] * -1
            },
            capitalize(str) {
                return str.charAt(0).toUpperCase() + str.slice(1)
            }
        }
    }
</script>


<style>
    table {
        background-color: #272522;

    }

    thead {
        background-color: #1f1e1b;
    }

    th {
        background-color: #1f1e1b;
        user-select: none;
    }

    td {
        background-color: #272522;
    }
    table tr {
    /* border-bottom: solid 1px #312e2b; */
    border-bottom: 2px solid #312e2b;
    }

    th,
    td {

        min-width: 120px;
        padding: 10px 20px;
    }

    th.active .arrow {
        opacity: 1;
    }

    .arrow {
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;
    }

    .arrow.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #fff;
    }

    .arrow.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #fff;
    }
    table tr:hover {
        background-color: #1f1e1b; 
    }
</style>