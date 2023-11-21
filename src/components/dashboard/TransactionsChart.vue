<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    title:String,
    chartLabels:[],
    chartSeries:[],
    chartColors:[]
});

// const select = ref('March 2023');
// const items = ref(['March 2023', 'April 2023', 'May 2023']);
const chartOptions = props.chartSeries && props.chartColors && props.chartLabels ? computed(() => {
    return {
        labels: props.chartLabels,
        chart: {
            type: 'donut',
            fontFamily: `inherit`,
            foreColor: '#a1aab2',
            toolbar: {
                show: false
            }
        },
        colors: props.chartColors,
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: '60%',
                    background: 'transparent'
                }
            }
        },
        stroke: {
            show: false
        },
        
        dataLabels: {
            enabled: true
        },
        legend: {
            show: true
        },
        tooltip: { theme: "light", fillSeriesColor: false },
    };
}):undefined;
</script>
<template>
    <v-card elevation="10" class="withbg">
        <v-card-item>
            <div class="d-sm-flex align-center justify-space-between pt-sm-2">
                <div><v-card-title class="text-h5">{{title}}</v-card-title></div>
                <!-- <div class="my-sm-0 my-2">
                    <v-select v-model="select" :items="items" variant="outlined" density="compact"
                        hide-details></v-select>
                </div> -->
            </div>
            <div class="mt-6">
                <apexchart v-if="chartSeries" type="donut" height="370px" :options="chartOptions" :series="props.chartSeries">
                </apexchart>
                <p v-else><i>No data</i></p>
            </div>
        </v-card-item>
    </v-card>
</template>