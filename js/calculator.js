/**
 * Filengro E-commerce Profit Calculator
 * Mathematical Calculation Engine
 */

window.ProfitCalculator = (function() {

    /**
     * Formats a number as Indian Currency (INR)
     * e.g. 1299 -> ₹1,299.00
     */
    function formatCurrency(val) {
        if (isNaN(val) || val === null || val === undefined) return "₹0.00";
        const isNegative = val < 0;
        const absVal = Math.abs(val);
        
        const formatted = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(absVal);

        return isNegative ? `-${formatted}` : formatted;
    }

    /**
     * Formats a number as Percentage
     * e.g. 15.2 -> 15.2%
     */
    function formatPercent(val) {
        if (isNaN(val) || val === null || val === undefined) return "0.0%";
        return `${val.toFixed(1)}%`;
    }

    /**
     * Main Calculation Function
     * @param {Object} inputs
     * @returns {Object} Complete Breakdown Output
     */
    function calculate(inputs) {
        // Sanitize & Parse numerical inputs
        const sellingPrice = Math.max(0, parseFloat(inputs.sellingPrice) || 0);
        const productCost = Math.max(0, parseFloat(inputs.productCost) || 0);
        const gstRate = Math.max(0, parseFloat(inputs.gstRate) || 0);
        const commissionRate = Math.max(0, parseFloat(inputs.commissionRate) || 0);
        const closingFee = Math.max(0, parseFloat(inputs.closingFee) || 0);
        const shippingFee = Math.max(0, parseFloat(inputs.shippingFee) || 0);
        const packagingCost = Math.max(0, parseFloat(inputs.packagingCost) || 0);
        const advertisingCost = Math.max(0, parseFloat(inputs.advertisingCost) || 0);
        const paymentGatewayRate = Math.max(0, parseFloat(inputs.paymentGatewayRate) || 0);
        const miscCharges = Math.max(0, parseFloat(inputs.miscCharges) || 0);
        
        const returnRate = Math.max(0, parseFloat(inputs.returnRate) || 0);
        const returnShipping = Math.max(0, parseFloat(inputs.returnShipping) || 0);
        const returnProcessing = Math.max(0, parseFloat(inputs.returnProcessing) || 0);

        // 1. GST Calculation on Product
        // GST included in selling price: Base Price = SP / (1 + GST%)
        const baseSellingPrice = sellingPrice / (1 + (gstRate / 100));
        const gstAmount = sellingPrice - baseSellingPrice;

        // 2. Direct Marketplace Charges
        const commissionAmount = sellingPrice * (commissionRate / 100);
        const pgAmount = sellingPrice * (paymentGatewayRate / 100);
        
        // Marketplace service fee subject to 18% GST (India standard)
        const marketplaceServicesSubtotal = commissionAmount + closingFee + shippingFee + pgAmount;
        const gstOnMarketplaceFees = marketplaceServicesSubtotal * 0.18;

        const directMarketplaceCharges = commissionAmount + closingFee + shippingFee + packagingCost + advertisingCost + pgAmount + miscCharges;
        const totalMarketplaceChargesWithGst = directMarketplaceCharges + gstOnMarketplaceFees;

        // 3. Return Cost Risk per Unit Sold
        const costPerReturn = returnShipping + returnProcessing + packagingCost;
        const returnCostPerUnitSold = (returnRate / 100) * costPerReturn;

        // 4. Total Expenses & Net Profit
        const totalExpenses = productCost + directMarketplaceCharges + gstAmount + gstOnMarketplaceFees + returnCostPerUnitSold;
        const netProfit = sellingPrice - totalExpenses;
        
        const profitMarginPct = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
        const totalInvestment = productCost + directMarketplaceCharges + weightedReturnCost(returnCostPerUnitSold);
        const roiPct = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

        function weightedReturnCost(rc) { return rc; }

        // 5. Break-Even Selling Price & Target Price Calculations
        // Variable fraction per ₹ of selling price
        const gstFraction = 1 - (1 / (1 + (gstRate / 100)));
        const commFraction = commissionRate / 100;
        const pgFraction = paymentGatewayRate / 100;
        const mpGstFraction = 0.18 * (commFraction + pgFraction);
        
        const variableFractionTotal = gstFraction + commFraction + pgFraction + mpGstFraction;

        // Fixed Costs Component
        const fixedCosts = productCost + closingFee + shippingFee + packagingCost + advertisingCost + miscCharges + (0.18 * (closingFee + shippingFee)) + returnCostPerUnitSold;

        // Break-even Price (where Margin = 0%)
        let breakEvenPrice = 0;
        if (variableFractionTotal < 1) {
            breakEvenPrice = fixedCosts / (1 - variableFractionTotal);
        } else {
            breakEvenPrice = fixedCosts * 2; // Safety fallback if variable costs exceed 100%
        }

        // Target Prices for 20%, 30%, 40% Margins
        function calculateTargetPrice(targetMarginPct) {
            const targetMarginFraction = targetMarginPct / 100;
            const denominator = 1 - variableFractionTotal - targetMarginFraction;
            if (denominator > 0.05) {
                const targetSP = fixedCosts / denominator;
                const targetProfit = targetSP * targetMarginFraction;
                return { price: targetSP, profit: targetProfit };
            }
            return { price: breakEvenPrice * (1 + targetMarginFraction), profit: breakEvenPrice * targetMarginFraction };
        }

        const target20 = calculateTargetPrice(20);
        const target30 = calculateTargetPrice(30);
        const target40 = calculateTargetPrice(40);

        return {
            // Raw Numerical Values
            sellingPrice,
            productCost,
            gstRate,
            gstAmount,
            baseSellingPrice,
            commissionRate,
            commissionAmount,
            closingFee,
            shippingFee,
            packagingCost,
            advertisingCost,
            paymentGatewayRate,
            pgAmount,
            miscCharges,
            directMarketplaceCharges,
            gstOnMarketplaceFees,
            totalMarketplaceChargesWithGst,
            returnRate,
            returnShipping,
            returnProcessing,
            returnCostPerUnitSold,
            totalExpenses,
            netProfit,
            profitMarginPct,
            roiPct,
            isProfitable: netProfit > 0,
            breakEvenPrice,
            target20,
            target30,
            target40,

            // Formatted Currency / Percent Strings
            formatted: {
                sellingPrice: formatCurrency(sellingPrice),
                productCost: formatCurrency(productCost),
                gstAmount: formatCurrency(gstAmount),
                commissionAmount: formatCurrency(commissionAmount),
                closingFee: formatCurrency(closingFee),
                shippingFee: formatCurrency(shippingFee),
                packagingCost: formatCurrency(packagingCost),
                advertisingCost: formatCurrency(advertisingCost),
                pgAmount: formatCurrency(pgAmount),
                miscCharges: formatCurrency(miscCharges),
                directMarketplaceCharges: formatCurrency(directMarketplaceCharges),
                gstOnMarketplaceFees: formatCurrency(gstOnMarketplaceFees),
                totalMarketplaceChargesWithGst: formatCurrency(totalMarketplaceChargesWithGst),
                returnCostPerUnitSold: formatCurrency(returnCostPerUnitSold),
                totalExpenses: formatCurrency(totalExpenses),
                netProfit: formatCurrency(netProfit),
                profitMarginPct: formatPercent(profitMarginPct),
                roiPct: formatPercent(roiPct),
                breakEvenPrice: formatCurrency(breakEvenPrice),
                target20Price: formatCurrency(target20.price),
                target20Profit: formatCurrency(target20.profit),
                target30Price: formatCurrency(target30.price),
                target30Profit: formatCurrency(target30.profit),
                target40Price: formatCurrency(target40.price),
                target40Profit: formatCurrency(target40.profit)
            }
        };
    }

    return {
        calculate: calculate,
        formatCurrency: formatCurrency,
        formatPercent: formatPercent
    };

})();
