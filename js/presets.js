/**
 * Filengro E-commerce Profit Calculator
 * Marketplace Presets & Charge Rules Configuration
 */

// Default Marketplace Presets Data Structure
const DEFAULT_MARKETPLACE_PRESETS = {
    "Amazon India": {
        commission: {
            "Electronics": 8,
            "Mobile Accessories": 12,
            "Fashion": 18,
            "Shoes": 18,
            "Beauty & Personal Care": 15,
            "Home & Kitchen": 15,
            "Grocery": 8,
            "Books": 12,
            "Sports": 15,
            "Jewellery": 20,
            "Automotive": 12,
            "Pet Supplies": 15,
            "Office Supplies": 12,
            "Handmade": 15,
            "Other": 15
        },
        closingFee: 12,
        shippingSlabs: {
            "0-500g": 55,
            "501g-1kg": 75,
            "1-2kg": 110,
            "2-5kg": 180,
            "5kg+": 280
        },
        packagingFee: 10,
        paymentGatewayPct: 2,
        returnProcessingFee: 50,
        returnShippingSlabs: {
            "0-500g": 55,
            "501g-1kg": 75,
            "1-2kg": 110,
            "2-5kg": 180,
            "5kg+": 280
        }
    },
    "Flipkart": {
        commission: {
            "Electronics": 10,
            "Mobile Accessories": 14,
            "Fashion": 18,
            "Shoes": 18,
            "Beauty & Personal Care": 16,
            "Home & Kitchen": 15,
            "Grocery": 10,
            "Books": 12,
            "Sports": 15,
            "Jewellery": 18,
            "Automotive": 14,
            "Pet Supplies": 15,
            "Office Supplies": 12,
            "Handmade": 15,
            "Other": 15
        },
        closingFee: 10,
        shippingSlabs: {
            "0-500g": 60,
            "501g-1kg": 80,
            "1-2kg": 120,
            "2-5kg": 190,
            "5kg+": 290
        },
        packagingFee: 10,
        paymentGatewayPct: 2,
        returnProcessingFee: 50,
        returnShippingSlabs: {
            "0-500g": 60,
            "501g-1kg": 80,
            "1-2kg": 120,
            "2-5kg": 190,
            "5kg+": 290
        }
    },
    "Meesho": {
        commission: {
            "Electronics": 0,
            "Mobile Accessories": 0,
            "Fashion": 0,
            "Shoes": 0,
            "Beauty & Personal Care": 0,
            "Home & Kitchen": 0,
            "Grocery": 0,
            "Books": 0,
            "Sports": 0,
            "Jewellery": 0,
            "Automotive": 0,
            "Pet Supplies": 0,
            "Office Supplies": 0,
            "Handmade": 0,
            "Other": 0
        },
        closingFee: 10,
        shippingSlabs: {
            "0-500g": 60,
            "501g-1kg": 80,
            "1-2kg": 120,
            "2-5kg": 180,
            "5kg+": 270
        },
        packagingFee: 10,
        paymentGatewayPct: 0,
        returnProcessingFee: 40,
        returnShippingSlabs: {
            "0-500g": 60,
            "501g-1kg": 80,
            "1-2kg": 120,
            "2-5kg": 180,
            "5kg+": 270
        }
    },
    "Shopify": {
        commission: {
            "Electronics": 0,
            "Mobile Accessories": 0,
            "Fashion": 0,
            "Shoes": 0,
            "Beauty & Personal Care": 0,
            "Home & Kitchen": 0,
            "Grocery": 0,
            "Books": 0,
            "Sports": 0,
            "Jewellery": 0,
            "Automotive": 0,
            "Pet Supplies": 0,
            "Office Supplies": 0,
            "Handmade": 0,
            "Other": 0
        },
        closingFee: 0,
        shippingSlabs: {
            "0-500g": 70,
            "501g-1kg": 90,
            "1-2kg": 130,
            "2-5kg": 200,
            "5kg+": 300
        },
        packagingFee: 10,
        paymentGatewayPct: 2,
        returnProcessingFee: 50,
        returnShippingSlabs: {
            "0-500g": 70,
            "501g-1kg": 90,
            "1-2kg": 130,
            "2-5kg": 200,
            "5kg+": 300
        }
    },
    "Myntra": {
        commission: {
            "Fashion": 20,
            "Shoes": 22,
            "Beauty & Personal Care": 18,
            "Jewellery": 22,
            "Mobile Accessories": 18,
            "Electronics": 18,
            "Home & Kitchen": 18,
            "Other": 20
        },
        closingFee: 15,
        shippingSlabs: {
            "0-500g": 70,
            "501g-1kg": 90,
            "1-2kg": 130,
            "2-5kg": 200,
            "5kg+": 300
        },
        packagingFee: 10,
        paymentGatewayPct: 2,
        returnProcessingFee: 60,
        returnShippingSlabs: {
            "0-500g": 70,
            "501g-1kg": 90,
            "1-2kg": 130,
            "2-5kg": 200,
            "5kg+": 300
        }
    },
    "JioMart": {
        commission: {
            "Grocery": 6,
            "Electronics": 8,
            "Mobile Accessories": 10,
            "Fashion": 15,
            "Home & Kitchen": 12,
            "Beauty & Personal Care": 12,
            "Other": 10
        },
        closingFee: 10,
        shippingSlabs: {
            "0-500g": 60,
            "501g-1kg": 80,
            "1-2kg": 120,
            "2-5kg": 180,
            "5kg+": 280
        },
        packagingFee: 10,
        paymentGatewayPct: 2,
        returnProcessingFee: 45,
        returnShippingSlabs: {
            "0-500g": 60,
            "501g-1kg": 80,
            "1-2kg": 120,
            "2-5kg": 180,
            "5kg+": 280
        }
    },
    "Other": {
        commission: {
            "Other": 0
        },
        closingFee: 0,
        shippingSlabs: {
            "0-500g": 0,
            "501g-1kg": 0,
            "1-2kg": 0,
            "2-5kg": 0,
            "5kg+": 0
        },
        packagingFee: 0,
        paymentGatewayPct: 0,
        returnProcessingFee: 0,
        returnShippingSlabs: {
            "0-500g": 0,
            "501g-1kg": 0,
            "1-2kg": 0,
            "2-5kg": 0,
            "5kg+": 0
        }
    }
};

// Main Presets Manager Object exposed globally
window.marketplacePresets = (function() {
    let presets = null;

    function init() {
        const saved = localStorage.getItem('filengro_marketplace_presets');
        if (saved) {
            try {
                presets = JSON.parse(saved);
            } catch(e) {
                console.error("Error loading custom presets, falling back to defaults", e);
                presets = JSON.parse(JSON.stringify(DEFAULT_MARKETPLACE_PRESETS));
            }
        } else {
            presets = JSON.parse(JSON.stringify(DEFAULT_MARKETPLACE_PRESETS));
        }
    }

    init();

    return {
        getAll: function() {
            if (!presets) init();
            return presets;
        },

        getPreset: function(marketplaceName) {
            if (!presets) init();
            return presets[marketplaceName] || presets["Other"];
        },

        getCommission: function(marketplaceName, categoryName) {
            const mp = this.getPreset(marketplaceName);
            if (mp && mp.commission) {
                if (mp.commission[categoryName] !== undefined) {
                    return mp.commission[categoryName];
                }
                if (mp.commission["Other"] !== undefined) {
                    return mp.commission["Other"];
                }
            }
            return 0;
        },

        getShipping: function(marketplaceName, weightSlab) {
            const mp = this.getPreset(marketplaceName);
            if (mp && mp.shippingSlabs && mp.shippingSlabs[weightSlab] !== undefined) {
                return mp.shippingSlabs[weightSlab];
            }
            return 0;
        },

        getReturnShipping: function(marketplaceName, weightSlab) {
            const mp = this.getPreset(marketplaceName);
            if (mp && mp.returnShippingSlabs && mp.returnShippingSlabs[weightSlab] !== undefined) {
                return mp.returnShippingSlabs[weightSlab];
            }
            return this.getShipping(marketplaceName, weightSlab);
        },

        savePresets: function(newPresets) {
            presets = newPresets;
            localStorage.setItem('filengro_marketplace_presets', JSON.stringify(presets));
        },

        resetToDefaults: function() {
            presets = JSON.parse(JSON.stringify(DEFAULT_MARKETPLACE_PRESETS));
            localStorage.removeItem('filengro_marketplace_presets');
            return presets;
        }
    };
})();
