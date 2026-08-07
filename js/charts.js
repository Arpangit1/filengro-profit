/**
 * Filengro E-commerce Profit Calculator
 * Chart.js Data Visualization Manager
 */

window.CalculatorCharts = (function() {
    let pieChart = null;
    let barChart = null;

    /**
     * Helper to get active theme color tokens
     */
    function getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            textColor: isDark ? '#94A3B8' : '#475569',
            gridColor: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)',
            fontFamily: "'Inter', sans-serif"
        };
    }

    /**
     * Initializes or Updates Charts with new calculation results
     * @param {Object} results - Output object from ProfitCalculator.calculate
     */
    function renderCharts(results) {
        if (typeof Chart === 'undefined') return;

        const theme = getThemeColors();

        // Prepare Doughnut Chart Data
        const pieLabels = [];
        const pieData = [];
        const pieColors = [];

        // 1. Sourcing Cost
        if (results.productCost > 0) {
            pieLabels.push('Product Cost');
            pieData.push(results.productCost);
            pieColors.push('#3B82F6');
        }

        // 2. Direct Marketplace Charges
        const mpFees = results.commissionAmount + results.closingFee + results.shippingFee + results.pgAmount + results.miscCharges + results.gstOnMarketplaceFees;
        if (mpFees > 0) {
            pieLabels.push('Marketplace Fees & GST');
            pieData.push(mpFees);
            pieColors.push('#F97316');
        }

        // 3. GST on Product
        if (results.gstAmount > 0) {
            pieLabels.push('GST on Product');
            pieData.push(results.gstAmount);
            pieColors.push('#8B5CF6');
        }

        // 4. Advertising
        if (results.advertisingCost > 0) {
            pieLabels.push('Advertising (CAC)');
            pieData.push(results.advertisingCost);
            pieColors.push('#EC4899');
        }

        // 5. Packaging
        if (results.packagingCost > 0) {
            pieLabels.push('Packaging');
            pieData.push(results.packagingCost);
            pieColors.push('#64748B');
        }

        // 6. Return Risk
        if (results.returnCostPerUnitSold > 0) {
            pieLabels.push('Return Cost Risk');
            pieData.push(results.returnCostPerUnitSold);
            pieColors.push('#EF4444');
        }

        // 7. Net Profit (Only if > 0)
        if (results.netProfit > 0) {
            pieLabels.push('Net Profit');
            pieData.push(results.netProfit);
            pieColors.push('#10B981');
        }

        // RENDER / UPDATE DOUGHNUT CHART
        const pieCtx = document.getElementById('costDistributionChart');
        if (pieCtx) {
            if (pieChart) {
                pieChart.data.labels = pieLabels;
                pieChart.data.datasets[0].data = pieData;
                pieChart.data.datasets[0].backgroundColor = pieColors;
                pieChart.options.plugins.legend.labels.color = theme.textColor;
                pieChart.update();
            } else {
                pieChart = new Chart(pieCtx, {
                    type: 'doughnut',
                    data: {
                        labels: pieLabels,
                        datasets: [{
                            data: pieData,
                            backgroundColor: pieColors,
                            borderWidth: 2,
                            borderColor: 'transparent'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '68%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    boxWidth: 12,
                                    font: { family: theme.fontFamily, size: 11 },
                                    color: theme.textColor
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.parsed || 0;
                                        return ` ${label}: ₹${value.toFixed(2)}`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // RENDER / UPDATE BAR CHART (FEE BREAKDOWN)
        const barCtx = document.getElementById('feeBreakdownChart');
        if (barCtx) {
            const barLabels = ['Commission', 'Shipping', 'Closing', 'PG Fee', 'Packaging', 'Ad Spend', 'Return Risk'];
            const barData = [
                results.commissionAmount,
                results.shippingFee,
                results.closingFee,
                results.pgAmount,
                results.packagingCost,
                results.advertisingCost,
                results.returnCostPerUnitSold
            ];

            if (barChart) {
                barChart.data.datasets[0].data = barData;
                barChart.options.scales.x.ticks.color = theme.textColor;
                barChart.options.scales.y.ticks.color = theme.textColor;
                barChart.options.scales.x.grid.color = theme.gridColor;
                barChart.options.scales.y.grid.color = theme.gridColor;
                barChart.update();
            } else {
                barChart = new Chart(barCtx, {
                    type: 'bar',
                    data: {
                        labels: barLabels,
                        datasets: [{
                            label: 'Fee Amount (₹)',
                            data: barData,
                            backgroundColor: '#F97316',
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return ` Fee: ₹${context.parsed.y.toFixed(2)}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: { display: false, color: theme.gridColor },
                                ticks: { font: { family: theme.fontFamily, size: 10 }, color: theme.textColor }
                            },
                            y: {
                                grid: { color: theme.gridColor },
                                ticks: { font: { family: theme.fontFamily, size: 10 }, color: theme.textColor }
                            }
                        }
                    }
                });
            }
        }
    }

    /**
     * Updates Chart Colors when Dark Mode is toggled
     */
    function updateTheme() {
        if (pieChart && barChart) {
            const theme = getThemeColors();
            pieChart.options.plugins.legend.labels.color = theme.textColor;
            barChart.options.scales.x.ticks.color = theme.textColor;
            barChart.options.scales.y.ticks.color = theme.textColor;
            barChart.options.scales.x.grid.color = theme.gridColor;
            barChart.options.scales.y.grid.color = theme.gridColor;
            pieChart.update();
            barChart.update();
        }
    }

    return {
        render: renderCharts,
        updateTheme: updateTheme
    };
})();
