/**
 * Filengro E-commerce Profit Calculator
 * Main UI Controller & Event Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. DOM ELEMENT SELECTION & CACHE
    // ----------------------------------------------------------------------
    const elements = {
        // Step 1: Product Inputs
        productName: document.getElementById('product-name'),
        productSku: document.getElementById('product-sku'),
        productCategory: document.getElementById('product-category'),
        sellingPrice: document.getElementById('selling-price'),
        productCost: document.getElementById('product-cost'),
        gstRate: document.getElementById('gst-rate'),
        weightSlab: document.getElementById('weight-slab'),

        // Step 2: Marketplace Radios
        marketplaceRadios: document.querySelectorAll('input[name="marketplace"]'),
        presetStatusBanner: document.getElementById('preset-status-banner'),
        activeCategoryLabel: document.getElementById('active-category-label'),

        // Step 3: Marketplace Charges Inputs
        commissionRate: document.getElementById('commission-rate'),
        closingFee: document.getElementById('closing-fee'),
        shippingFee: document.getElementById('shipping-fee'),
        packagingCost: document.getElementById('packaging-cost'),
        advertisingCost: document.getElementById('advertising-cost'),
        paymentGateway: document.getElementById('payment-gateway'),
        miscCharges: document.getElementById('misc-charges'),

        // Step 4: Return Inputs
        returnRate: document.getElementById('return-rate'),
        returnShipping: document.getElementById('return-shipping'),
        returnProcessing: document.getElementById('return-processing'),

        // Action Buttons
        btnCalculate: document.getElementById('btn-calculate'),
        btnReset: document.getElementById('btn-reset'),
        btnSave: document.getElementById('btn-save'),
        btnCopy: document.getElementById('btn-copy'),
        btnPdf: document.getElementById('btn-pdf'),
        btnPrint: document.getElementById('btn-print'),
        themeToggle: document.getElementById('theme-toggle'),

        // Dashboard Results Display
        profitStatusCard: document.getElementById('profit-status-card'),
        statusPill: document.getElementById('status-pill'),
        statusText: document.getElementById('status-text'),
        resNetProfit: document.getElementById('res-net-profit'),
        resMargin: document.getElementById('res-margin'),
        resRoi: document.getElementById('res-roi'),
        resBreakeven: document.getElementById('res-breakeven'),
        resRevenue: document.getElementById('res-revenue'),
        resGst: document.getElementById('res-gst'),
        resTotalCharges: document.getElementById('res-total-charges'),
        resReturnCost: document.getElementById('res-return-cost'),

        // Table Breakdown Elements
        tblCost: document.getElementById('tbl-cost'),
        tblCommRate: document.getElementById('tbl-comm-rate'),
        tblCommission: document.getElementById('tbl-commission'),
        tblClosing: document.getElementById('tbl-closing'),
        tblWeight: document.getElementById('tbl-weight'),
        tblShipping: document.getElementById('tbl-shipping'),
        tblPackaging: document.getElementById('tbl-packaging'),
        tblAdvertising: document.getElementById('tbl-advertising'),
        tblPgRate: document.getElementById('tbl-pg-rate'),
        tblPg: document.getElementById('tbl-pg'),
        tblMisc: document.getElementById('tbl-misc'),
        tblTotalFees: document.getElementById('tbl-total-fees'),

        // Target Selling Prices
        target20Price: document.getElementById('target-20-price'),
        target20Profit: document.getElementById('target-20-profit'),
        target30Price: document.getElementById('target-30-price'),
        target30Profit: document.getElementById('target-30-profit'),
        target40Price: document.getElementById('target-40-price'),
        target40Profit: document.getElementById('target-40-profit'),

        // Mobile Sticky Bar
        mobileBar: document.getElementById('mobile-bar'),
        mobileProfitVal: document.getElementById('mobile-profit-val'),
        btnMobileCalc: document.getElementById('btn-mobile-calc'),
        btnMobileSave: document.getElementById('btn-mobile-save'),

        // History Modal
        btnHistory: document.getElementById('btn-history'),
        historyBadge: document.getElementById('history-badge'),
        modalHistory: document.getElementById('modal-history'),
        closeHistory: document.getElementById('close-history'),
        historySearch: document.getElementById('history-search'),
        btnClearHistory: document.getElementById('btn-clear-history'),
        btnExportCsv: document.getElementById('btn-export-csv'),
        historyContainer: document.getElementById('history-list-container'),

        // Preset Modal
        btnManagePresets: document.getElementById('btn-manage-presets'),
        modalPresets: document.getElementById('modal-presets'),
        closePresets: document.getElementById('close-presets'),
        presetEditorSelect: document.getElementById('preset-editor-select'),
        presetEditorFields: document.getElementById('preset-editor-fields'),
        btnResetPresets: document.getElementById('btn-reset-presets'),
        btnSavePresets: document.getElementById('btn-save-presets'),

        // Toast Container
        toastContainer: document.getElementById('toast-container')
    };

    // State Variables
    let currentResults = null;
    let savedCalculations = [];

    // ----------------------------------------------------------------------
    // 2. HELPER UTILITIES
    // ----------------------------------------------------------------------
    function getSelectedMarketplace() {
        const checked = document.querySelector('input[name="marketplace"]:checked');
        return checked ? checked.value : 'Amazon India';
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ----------------------------------------------------------------------
    // 3. AUTO-LOAD MARKETPLACE PRESETS
    // ----------------------------------------------------------------------
    function applyMarketplacePresets(forceAll = true) {
        const mpName = getSelectedMarketplace();
        const category = elements.productCategory.value;
        const weight = elements.weightSlab.value;

        const preset = window.marketplacePresets.getPreset(mpName);
        const commRate = window.marketplacePresets.getCommission(mpName, category);
        const shipFee = window.marketplacePresets.getShipping(mpName, weight);
        const retShipFee = window.marketplacePresets.getReturnShipping(mpName, weight);

        if (forceAll) {
            elements.commissionRate.value = commRate;
            elements.closingFee.value = preset.closingFee || 0;
            elements.shippingFee.value = shipFee;
            elements.packagingCost.value = preset.packagingFee || 10;
            elements.paymentGateway.value = preset.paymentGatewayPct !== undefined ? preset.paymentGatewayPct : 2;
            elements.returnProcessing.value = preset.returnProcessingFee || 50;
            elements.returnShipping.value = retShipFee;
        }

        // Update Radio Card UI
        elements.marketplaceRadios.forEach(radio => {
            const card = radio.closest('.marketplace-radio-card');
            if (card) {
                if (radio.checked) card.classList.add('active');
                else card.classList.remove('active');
            }
        });

        // Update Preset Indicator Banner
        elements.activeCategoryLabel.textContent = category;
        elements.presetStatusBanner.querySelector('strong').textContent = mpName;

        // Perform Calculation
        recalculate();
    }

    function updateCategoryPresetOnly() {
        const mpName = getSelectedMarketplace();
        const category = elements.productCategory.value;
        const commRate = window.marketplacePresets.getCommission(mpName, category);
        elements.commissionRate.value = commRate;
        elements.activeCategoryLabel.textContent = category;
        recalculate();
    }

    function updateWeightPresetOnly() {
        const mpName = getSelectedMarketplace();
        const weight = elements.weightSlab.value;
        const shipFee = window.marketplacePresets.getShipping(mpName, weight);
        const retShipFee = window.marketplacePresets.getReturnShipping(mpName, weight);
        elements.shippingFee.value = shipFee;
        elements.returnShipping.value = retShipFee;
        recalculate();
    }

    // ----------------------------------------------------------------------
    // 4. CORE RECALCULATION & UI UPDATE
    // ----------------------------------------------------------------------
    function recalculate() {
        const spVal = elements.sellingPrice.value;
        const pcVal = elements.productCost.value;
        const emptyStateCard = document.getElementById('empty-state-card');
        const hasPrice = spVal !== '' && parseFloat(spVal) > 0;
        const hasCost = pcVal !== '' && parseFloat(pcVal) >= 0;

        // Show empty state if selling price is blank, hide results
        if (!hasPrice) {
            if (emptyStateCard) emptyStateCard.style.display = 'flex';
            elements.profitStatusCard.style.display = 'none';
            return;
        }

        // Hide empty state, show results
        if (emptyStateCard) emptyStateCard.style.display = 'none';
        elements.profitStatusCard.style.display = '';

        const inputs = {
            productName: elements.productName.value,
            productSku: elements.productSku.value,
            category: elements.productCategory.value,
            sellingPrice: spVal,
            productCost: pcVal,
            gstRate: elements.gstRate.value,
            weightSlab: elements.weightSlab.value,
            commissionRate: elements.commissionRate.value,
            closingFee: elements.closingFee.value,
            shippingFee: elements.shippingFee.value,
            packagingCost: elements.packagingCost.value,
            advertisingCost: elements.advertisingCost.value,
            paymentGatewayRate: elements.paymentGateway.value,
            miscCharges: elements.miscCharges.value,
            returnRate: elements.returnRate.value,
            returnShipping: elements.returnShipping.value,
            returnProcessing: elements.returnProcessing.value
        };

        currentResults = window.ProfitCalculator.calculate(inputs);

        // Update Executive Dashboard Summary Cards
        elements.resNetProfit.textContent = currentResults.formatted.netProfit;
        elements.resMargin.textContent = currentResults.formatted.profitMarginPct;
        elements.resRoi.textContent = currentResults.formatted.roiPct;
        elements.resBreakeven.textContent = currentResults.formatted.breakEvenPrice;
        elements.resRevenue.textContent = currentResults.formatted.sellingPrice;
        elements.resGst.textContent = currentResults.formatted.gstAmount;
        elements.resTotalCharges.textContent = currentResults.formatted.totalMarketplaceChargesWithGst;
        elements.resReturnCost.textContent = currentResults.formatted.returnCostPerUnitSold;

        // Mobile Sticky Bar Profit
        elements.mobileProfitVal.textContent = currentResults.formatted.netProfit;

        // Update Profit Status Card Banner
        if (currentResults.isProfitable) {
            elements.profitStatusCard.className = 'glass-card status-card status-profitable';
            elements.statusText.textContent = 'Profitable Product';
            elements.statusPill.style.backgroundColor = 'var(--profit-green-bg)';
            elements.statusPill.style.color = 'var(--profit-green)';
            elements.mobileProfitVal.style.color = 'var(--profit-green)';
        } else {
            elements.profitStatusCard.className = 'glass-card status-card status-loss';
            elements.statusText.textContent = 'Loss Making Product';
            elements.statusPill.style.backgroundColor = 'var(--loss-red-bg)';
            elements.statusPill.style.color = 'var(--loss-red)';
            elements.mobileProfitVal.style.color = 'var(--loss-red)';
        }

        // Update Fee Breakdown Table
        elements.tblCost.textContent = currentResults.formatted.productCost;
        elements.tblCommRate.textContent = `${inputs.commissionRate}%`;
        elements.tblCommission.textContent = currentResults.formatted.commissionAmount;
        elements.tblClosing.textContent = currentResults.formatted.closingFee;
        elements.tblWeight.textContent = inputs.weightSlab;
        elements.tblShipping.textContent = currentResults.formatted.shippingFee;
        elements.tblPackaging.textContent = currentResults.formatted.packagingCost;
        elements.tblAdvertising.textContent = currentResults.formatted.advertisingCost;
        elements.tblPgRate.textContent = `${inputs.paymentGatewayRate}%`;
        elements.tblPg.textContent = currentResults.formatted.pgAmount;
        elements.tblMisc.textContent = currentResults.formatted.miscCharges;
        elements.tblTotalFees.textContent = currentResults.formatted.totalMarketplaceChargesWithGst;

        // Update Target Pricing
        elements.target20Price.textContent = currentResults.formatted.target20Price;
        elements.target20Profit.textContent = `Profit: ${currentResults.formatted.target20Profit}`;
        elements.target30Price.textContent = currentResults.formatted.target30Price;
        elements.target30Profit.textContent = `Profit: ${currentResults.formatted.target30Profit}`;
        elements.target40Price.textContent = currentResults.formatted.target40Price;
        elements.target40Profit.textContent = `Profit: ${currentResults.formatted.target40Profit}`;

        // Render / Update Chart Visualizations
        window.CalculatorCharts.render(currentResults);
    }

    // ----------------------------------------------------------------------
    // 5. EVENT LISTENERS SETUP
    // ----------------------------------------------------------------------
    // Live calculation input handlers
    const inputFields = [
        elements.productName, elements.productSku, elements.sellingPrice,
        elements.productCost, elements.gstRate, elements.commissionRate,
        elements.closingFee, elements.shippingFee, elements.packagingCost,
        elements.advertisingCost, elements.paymentGateway, elements.miscCharges,
        elements.returnRate, elements.returnShipping, elements.returnProcessing
    ];

    inputFields.forEach(input => {
        if (input) {
            input.addEventListener('input', recalculate);
            input.addEventListener('change', recalculate);
        }
    });

    // Step 2 Marketplace radio selection
    elements.marketplaceRadios.forEach(radio => {
        radio.addEventListener('change', () => applyMarketplacePresets(true));
    });

    // Category change listener -> updates category commission
    elements.productCategory.addEventListener('change', updateCategoryPresetOnly);

    // Weight slab change listener -> updates shipping
    elements.weightSlab.addEventListener('change', updateWeightPresetOnly);

    // Primary Action Buttons
    elements.btnCalculate.addEventListener('click', () => {
        recalculate();
        showToast("Profit recalculated successfully!", "success");
        if (window.innerWidth <= 1100) {
            elements.profitStatusCard.scrollIntoView({ behavior: 'smooth' });
        }
    });

    if (elements.btnMobileCalc) {
        elements.btnMobileCalc.addEventListener('click', () => {
            recalculate();
            elements.profitStatusCard.scrollIntoView({ behavior: 'smooth' });
        });
    }

    elements.btnReset.addEventListener('click', () => {
        // Clear Product Input Fields
        elements.productName.value = '';
        elements.productSku.value = '';
        elements.productCategory.value = 'Mobile Accessories';
        elements.sellingPrice.value = '';
        elements.productCost.value = '';
        elements.gstRate.value = '18';
        elements.weightSlab.value = '0-500g';
        elements.advertisingCost.value = '50';
        elements.miscCharges.value = '0';
        elements.returnRate.value = '8';

        // Select Amazon India
        const amazonRadio = document.querySelector('input[name="marketplace"][value="Amazon India"]');
        if (amazonRadio) amazonRadio.checked = true;

        // Reload marketplace fee presets (fills Step 3 & 4 fee fields)
        applyMarketplacePresets(true);

        // Reset all result displays back to dashes
        currentResults = null;
        const dash = '—';

        elements.resNetProfit.textContent = dash;
        elements.resMargin.textContent = dash;
        elements.resRoi.textContent = dash;
        elements.resBreakeven.textContent = dash;
        elements.resRevenue.textContent = dash;
        elements.resGst.textContent = dash;
        elements.resTotalCharges.textContent = dash;
        elements.resReturnCost.textContent = dash;
        elements.mobileProfitVal.textContent = '₹0.00';
        elements.mobileProfitVal.style.color = 'var(--profit-green)';

        // Reset breakdown table
        elements.tblCost.textContent = dash;
        elements.tblCommission.textContent = dash;
        elements.tblClosing.textContent = dash;
        elements.tblShipping.textContent = dash;
        elements.tblPackaging.textContent = dash;
        elements.tblAdvertising.textContent = dash;
        elements.tblPg.textContent = dash;
        elements.tblMisc.textContent = dash;
        elements.tblTotalFees.innerHTML = `<strong>${dash}</strong>`;

        // Reset target pricing
        elements.target20Price.textContent = dash;
        elements.target20Profit.textContent = `Profit: ${dash}`;
        elements.target30Price.textContent = dash;
        elements.target30Profit.textContent = `Profit: ${dash}`;
        elements.target40Price.textContent = dash;
        elements.target40Profit.textContent = `Profit: ${dash}`;

        // Show empty state, hide results card
        const emptyStateCard = document.getElementById('empty-state-card');
        if (emptyStateCard) emptyStateCard.style.display = 'flex';
        elements.profitStatusCard.style.display = 'none';

        showToast('Form cleared. Enter Selling Price & Product Cost to begin.', 'info');
    });

    // Save Calculation to LocalStorage
    function saveCurrentCalculation() {
        if (!currentResults) return;
        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('en-IN'),
            productName: elements.productName.value || 'Unnamed Product',
            marketplace: getSelectedMarketplace(),
            sellingPrice: currentResults.sellingPrice,
            netProfit: currentResults.netProfit,
            marginPct: currentResults.profitMarginPct,
            formattedProfit: currentResults.formatted.netProfit,
            formattedMargin: currentResults.formatted.profitMarginPct,
            inputs: {
                productName: elements.productName.value,
                productSku: elements.productSku.value,
                category: elements.productCategory.value,
                sellingPrice: elements.sellingPrice.value,
                productCost: elements.productCost.value,
                gstRate: elements.gstRate.value,
                weightSlab: elements.weightSlab.value,
                marketplace: getSelectedMarketplace(),
                commissionRate: elements.commissionRate.value,
                closingFee: elements.closingFee.value,
                shippingFee: elements.shippingFee.value,
                packagingCost: elements.packagingCost.value,
                advertisingCost: elements.advertisingCost.value,
                paymentGateway: elements.paymentGateway.value,
                miscCharges: elements.miscCharges.value,
                returnRate: elements.returnRate.value,
                returnShipping: elements.returnShipping.value,
                returnProcessing: elements.returnProcessing.value
            }
        };

        savedCalculations.unshift(entry);
        localStorage.setItem('filengro_saved_calculations', JSON.stringify(savedCalculations));
        updateHistoryBadge();
        showToast("Calculation saved to local history!", "success");
    }

    elements.btnSave.addEventListener('click', saveCurrentCalculation);
    if (elements.btnMobileSave) {
        elements.btnMobileSave.addEventListener('click', saveCurrentCalculation);
    }

    // Copy Results to Clipboard
    elements.btnCopy.addEventListener('click', () => {
        if (!currentResults) return;
        const text = `📊 FILENGRO E-COMMERCE PROFIT BREAKDOWN
Product: ${elements.productName.value || 'Product'}
Marketplace: ${getSelectedMarketplace()}
Selling Price: ${currentResults.formatted.sellingPrice}
Product Cost: ${currentResults.formatted.productCost}
---------------------------------
GST Amount: ${currentResults.formatted.gstAmount}
Marketplace Charges: ${currentResults.formatted.totalMarketplaceChargesWithGst}
Estimated Return Risk: ${currentResults.formatted.returnCostPerUnitSold}
---------------------------------
NET PROFIT: ${currentResults.formatted.netProfit}
PROFIT MARGIN: ${currentResults.formatted.profitMarginPct}
ROI: ${currentResults.formatted.roiPct}
BREAK-EVEN PRICE: ${currentResults.formatted.breakEvenPrice}
---------------------------------
Calculated via Filengro Profit Calculator`;

        navigator.clipboard.writeText(text).then(() => {
            showToast("Profit summary copied to clipboard!", "success");
        }).catch(err => {
            console.error("Clipboard copy failed", err);
            showToast("Failed to copy results", "error");
        });
    });

    // PDF Download
    elements.btnPdf.addEventListener('click', () => {
        if (!currentResults) return;
        const inputs = {
            productName: elements.productName.value,
            productSku: elements.productSku.value,
            category: elements.productCategory.value,
            weightSlab: elements.weightSlab.value,
            gstRate: elements.gstRate.value,
            commissionRate: elements.commissionRate.value,
            paymentGatewayRate: elements.paymentGateway.value,
            returnRate: elements.returnRate.value
        };
        window.PDFExporter.export(inputs, currentResults, getSelectedMarketplace());
        showToast("PDF report generated successfully!", "success");
    });

    // Print Button
    elements.btnPrint.addEventListener('click', () => {
        window.print();
    });

    // ----------------------------------------------------------------------
    // 6. DARK MODE THEME TOGGLE
    // ----------------------------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem('filengro_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    elements.themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('filengro_theme', newTheme);
        window.CalculatorCharts.updateTheme();
        showToast(`Switched to ${newTheme} theme`, "info");
    });

    initTheme();

    // ----------------------------------------------------------------------
    // 7. SAVED CALCULATIONS HISTORY MODAL
    // ----------------------------------------------------------------------
    function loadHistoryFromStorage() {
        const saved = localStorage.getItem('filengro_saved_calculations');
        if (saved) {
            try {
                savedCalculations = JSON.parse(saved);
            } catch(e) {
                savedCalculations = [];
            }
        }
        updateHistoryBadge();
    }

    function updateHistoryBadge() {
        elements.historyBadge.textContent = savedCalculations.length;
    }

    function renderHistoryList(filterQuery = '') {
        elements.historyContainer.innerHTML = '';

        const filtered = savedCalculations.filter(item => {
            const query = filterQuery.toLowerCase();
            return item.productName.toLowerCase().includes(query) ||
                   item.marketplace.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            elements.historyContainer.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-muted);">No saved calculations found.</div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-item-card';
            const isPos = item.netProfit > 0;
            const profitColor = isPos ? 'var(--profit-green)' : 'var(--loss-red)';

            card.innerHTML = `
                <div class="history-info">
                    <span class="history-name">${item.productName}</span>
                    <span class="history-meta">${item.marketplace} • ${item.timestamp}</span>
                </div>
                <div class="history-profit" style="color: ${profitColor};">
                    ${item.formattedProfit} (${item.formattedMargin})
                </div>
            `;

            card.addEventListener('click', () => {
                restoreSavedCalculation(item);
                elements.modalHistory.classList.remove('active');
                showToast(`Loaded calculation for "${item.productName}"`, "info");
            });

            elements.historyContainer.appendChild(card);
        });
    }

    function restoreSavedCalculation(item) {
        if (!item || !item.inputs) return;
        const inp = item.inputs;

        elements.productName.value = inp.productName || '';
        elements.productSku.value = inp.productSku || '';
        elements.productCategory.value = inp.category || 'Mobile Accessories';
        elements.sellingPrice.value = inp.sellingPrice || 0;
        elements.productCost.value = inp.productCost || 0;
        elements.gstRate.value = inp.gstRate || 18;
        elements.weightSlab.value = inp.weightSlab || '0-500g';

        const radio = document.querySelector(`input[name="marketplace"][value="${inp.marketplace}"]`);
        if (radio) radio.checked = true;

        elements.commissionRate.value = inp.commissionRate || 0;
        elements.closingFee.value = inp.closingFee || 0;
        elements.shippingFee.value = inp.shippingFee || 0;
        elements.packagingCost.value = inp.packagingCost || 0;
        elements.advertisingCost.value = inp.advertisingCost || 0;
        elements.paymentGateway.value = inp.paymentGateway || 0;
        elements.miscCharges.value = inp.miscCharges || 0;

        elements.returnRate.value = inp.returnRate || 0;
        elements.returnShipping.value = inp.returnShipping || 0;
        elements.returnProcessing.value = inp.returnProcessing || 0;

        recalculate();
    }

    elements.btnHistory.addEventListener('click', () => {
        renderHistoryList();
        elements.modalHistory.classList.add('active');
    });

    elements.closeHistory.addEventListener('click', () => {
        elements.modalHistory.classList.remove('active');
    });

    elements.historySearch.addEventListener('input', (e) => {
        renderHistoryList(e.target.value);
    });

    elements.btnClearHistory.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all saved calculations history?")) {
            savedCalculations = [];
            localStorage.removeItem('filengro_saved_calculations');
            updateHistoryBadge();
            renderHistoryList();
            showToast("Saved history cleared.", "info");
        }
    });

    elements.btnExportCsv.addEventListener('click', () => {
        if (savedCalculations.length === 0) {
            showToast("No history to export.", "info");
            return;
        }

        let csv = "ID,Timestamp,Product Name,Marketplace,Selling Price,Net Profit,Margin Pct\n";
        savedCalculations.forEach(c => {
            csv += `"${c.id}","${c.timestamp}","${c.productName}","${c.marketplace}",${c.sellingPrice},${c.netProfit},${c.marginPct}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `filengro_profit_history_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // ----------------------------------------------------------------------
    // 8. CUSTOM PRESET EDITOR MODAL
    // ----------------------------------------------------------------------
    function renderPresetEditor(mpName) {
        elements.presetEditorFields.innerHTML = '';
        const preset = window.marketplacePresets.getPreset(mpName);

        elements.presetEditorFields.innerHTML = `
            <div class="form-group">
                <label>Default Commission % (Mobile Accessories)</label>
                <input type="number" id="edit-comm" value="${preset.commission["Mobile Accessories"] || preset.commission["Other"] || 10}">
            </div>
            <div class="form-group">
                <label>Closing Fee (₹)</label>
                <input type="number" id="edit-closing" value="${preset.closingFee || 0}">
            </div>
            <div class="form-group">
                <label>Packaging Fee (₹)</label>
                <input type="number" id="edit-packaging" value="${preset.packagingFee || 10}">
            </div>
            <div class="form-group">
                <label>Payment Gateway %</label>
                <input type="number" id="edit-pg" value="${preset.paymentGatewayPct !== undefined ? preset.paymentGatewayPct : 2}">
            </div>
            <div class="form-group">
                <label>Return Processing Fee (₹)</label>
                <input type="number" id="edit-return-proc" value="${preset.returnProcessingFee || 50}">
            </div>
        `;
    }

    elements.btnManagePresets.addEventListener('click', () => {
        renderPresetEditor(elements.presetEditorSelect.value);
        elements.modalPresets.classList.add('active');
    });

    elements.closePresets.addEventListener('click', () => {
        elements.modalPresets.classList.remove('active');
    });

    elements.presetEditorSelect.addEventListener('change', (e) => {
        renderPresetEditor(e.target.value);
    });

    elements.btnSavePresets.addEventListener('click', () => {
        const mpName = elements.presetEditorSelect.value;
        const currentPresets = window.marketplacePresets.getAll();

        if (currentPresets[mpName]) {
            currentPresets[mpName].closingFee = parseFloat(document.getElementById('edit-closing').value) || 0;
            currentPresets[mpName].packagingFee = parseFloat(document.getElementById('edit-packaging').value) || 0;
            currentPresets[mpName].paymentGatewayPct = parseFloat(document.getElementById('edit-pg').value) || 0;
            currentPresets[mpName].returnProcessingFee = parseFloat(document.getElementById('edit-return-proc').value) || 0;
            
            const newComm = parseFloat(document.getElementById('edit-comm').value) || 10;
            if (currentPresets[mpName].commission) {
                currentPresets[mpName].commission["Mobile Accessories"] = newComm;
            }

            window.marketplacePresets.savePresets(currentPresets);
            applyMarketplacePresets(true);
            elements.modalPresets.classList.remove('active');
            showToast(`Presets updated for ${mpName}!`, "success");
        }
    });

    elements.btnResetPresets.addEventListener('click', () => {
        if (confirm("Reset all marketplace presets back to factory defaults?")) {
            window.marketplacePresets.resetToDefaults();
            applyMarketplacePresets(true);
            elements.modalPresets.classList.remove('active');
            showToast("Marketplace presets restored to defaults.", "info");
        }
    });

    // ----------------------------------------------------------------------
    // 9. SERVICE WORKER REGISTRATION FOR PWA
    // ----------------------------------------------------------------------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(reg => {
                console.log('Filengro ServiceWorker registered successfully:', reg.scope);
            }).catch(err => {
                console.warn('ServiceWorker registration failed:', err);
            });
        });
    }

    // INITIALIZATION
    loadHistoryFromStorage();
    applyMarketplacePresets(true);
});
