<template>
    <div class="container chart pt-3 pb-3" id="streakContainer">
        <div class="row streak-chart">
            <div class="card streak-chart">
                <div class="card-body">
                    <div class="card-text"></div>
                    <div class="card-title">
                        <h2>
                            <strong>
                                Winning Streaks
                            </strong>
                        </h2>
                    </div>

                    <!-- Streak Summary -->
                    <div class="streak-summary mb-3">
                        <div class="row text-center">
                            <div class="col">
                                <div class="streak-stat">
                                    <h4 class="streak-number" :class="currentStreakClass">{{ currentStreakCount }}</h4>
                                    <small>Current {{ currentStreakType }} Streak</small>
                                </div>
                            </div>
                            <div class="col">
                                <div class="streak-stat">
                                    <h4 class="streak-number text-success">{{ longestWinStreak }}</h4>
                                    <small>Longest Win Streak</small>
                                </div>
                            </div>
                            <div class="col">
                                <div class="streak-stat">
                                    <h4 class="streak-number text-danger">{{ longestLossStreak }}</h4>
                                    <small>Longest Loss Streak</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Chart -->
                    <div class="container chartContainer p-3">
                        <canvas id="streakChart"></canvas>
                    </div>

                    <!-- Time Class Buttons -->
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'all' }" @click="updateStreak('all')">All</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'bullet' }" @click="updateStreak('bullet')">Bullet</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'blitz' }" @click="updateStreak('blitz')">Blitz</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'rapid' }" @click="updateStreak('rapid')">Rapid</button>
                    <button class="btn btn-primary slicer" :class="{ active: timeClass === 'daily' }" @click="updateStreak('daily')">Daily</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getStreakChartData } from '~/utils/streakUtils.js'
import Chart from 'chart.js/auto'

export default {
    name: "StreakChart",
    props: {
        timeClass: String,
    },
    data() {
        return {
            currentStreakCount: 0,
            currentStreakType: 'none',
            longestWinStreak: 0,
            longestLossStreak: 0,
            chart: null
        }
    },
    computed: {
        currentStreakClass() {
            if (this.currentStreakType === 'win') return 'text-success';
            if (this.currentStreakType === 'loss') return 'text-danger';
            if (this.currentStreakType === 'draw') return 'text-secondary';
            return 'text-muted';
        }
    },
    methods: {
        updateStreak(newTimeClass) {
            this.$emit('updateStreak', newTimeClass);
            this.renderChart(newTimeClass);
        },
        
        renderChart(timeClass) {
            let chartData = getStreakChartData(timeClass);
            
            // Update summary data
            this.currentStreakCount = chartData.streakData.currentStreak.count;
            this.currentStreakType = chartData.streakData.currentStreak.type;
            this.longestWinStreak = chartData.streakData.longestWinStreak;
            this.longestLossStreak = chartData.streakData.longestLossStreak;
            
            const ctx = document.getElementById("streakChart");
            
            // Destroy existing chart if it exists
            if (this.chart) {
                this.chart.destroy();
            }
            
            let green = "#708641";
            let grey = "#888683";
            let red = "#8f3431";
            
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: 'Win Streaks',
                            data: chartData.winData,
                            backgroundColor: green,
                            borderColor: green,
                            borderWidth: 1
                        },
                        {
                            label: 'Loss Streaks',
                            data: chartData.lossData,
                            backgroundColor: red,
                            borderColor: red,
                            borderWidth: 1
                        },
                        {
                            label: 'Draw Streaks',
                            data: chartData.drawData,
                            backgroundColor: grey,
                            borderColor: grey,
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                title: function(tooltipItems) {
                                    return `Streak ${tooltipItems[0].dataIndex + 1}`;
                                },
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y > 0) {
                                        label += context.parsed.y + ' games';
                                    }
                                    return context.parsed.y > 0 ? label : null;
                                },
                                footer: function(tooltipItems) {
                                    // Could add more details here like dates
                                    return '';
                                }
                            },
                            filter: function(tooltipItem) {
                                return tooltipItem.parsed.y > 0;
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Streak Length (Games)'
                            },
                            ticks: {
                                stepSize: 1
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Recent Streaks (Chronological Order)'
                            }
                        }
                    }
                }
            });
        }
    },
    mounted: function() {
        this.renderChart(this.timeClass);
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
}
</script>

<style scoped>
.streak-summary {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
}

.streak-stat {
    padding: 10px;
}

.streak-number {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.chartContainer {
    height: 400px;
}

#streakChart {
    max-height: 100%;
}

.slicer {
    margin: 5px;
}

.slicer.active {
    background-color: #0d6efd !important;
    border-color: #0d6efd !important;
}
</style>