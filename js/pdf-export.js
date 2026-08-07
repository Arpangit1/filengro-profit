/**
 * Filengro E-commerce Profit Calculator
 * PDF Generator Utility — Redesigned v2.0
 * Website: www.ecomprofit.filengro.in
 */

window.PDFExporter = (function () {

    // ── Colour palette ──────────────────────────────────────────────────────
    const C = {
        navy:       [15,  23,  42],
        navyMid:    [30,  41,  59],
        orange:     [249, 115, 22],
        orangeLight:[255, 237, 213],
        green:      [16,  185, 129],
        greenLight: [209, 250, 229],
        red:        [239, 68,  68],
        redLight:   [254, 226, 226],
        slate:      [71,  85,  105],
        slateLight: [148, 163, 184],
        muted:      [241, 245, 249],
        border:     [203, 213, 225],
        white:      [255, 255, 255],
    };

    // ── Tiny helpers ─────────────────────────────────────────────────────────
    const rgb = (doc, key) => doc.setTextColor(...C[key]);
    const fill = (doc, key) => doc.setFillColor(...C[key]);
    const draw = (doc, key) => doc.setDrawColor(...C[key]);

    function hLine(doc, y, x1 = 14, x2 = 196, w = 0.25) {
        doc.setDrawColor(...C.border);
        doc.setLineWidth(w);
        doc.line(x1, y, x2, y);
    }

    function label(doc, txt, x, y, size = 7.5) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(size);
        rgb(doc, 'slateLight');
        doc.text(txt, x, y);
    }

    function value(doc, txt, x, y, size = 9, align = 'left') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(size);
        rgb(doc, 'navy');
        doc.text(txt, x, y, { align });
    }

    function sectionTitle(doc, txt, y) {
        // Accent bar
        doc.setFillColor(...C.orange);
        doc.rect(14, y - 3.5, 3, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(...C.navy);
        doc.text(txt, 20, y);
    }

    // ── Main generator ───────────────────────────────────────────────────────
    function generatePDF(inputs, results, marketplaceName) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert('PDF library is loading. Please try again in a moment.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const PW = 210; // page width
        const ML = 14;  // left margin
        const MR = 196; // right edge

        // ══════════════════════════════════════════════════════════════════════
        // HEADER  (0 → 38 mm)
        // ══════════════════════════════════════════════════════════════════════
        doc.setFillColor(...C.navy);
        doc.rect(0, 0, PW, 38, 'F');

        // Brand name – "Filen" white + "gro" orange
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...C.white);
        doc.text('Filen', ML, 16);
        doc.setTextColor(...C.orange);
        doc.text('gro', ML + 21.5, 16);

        // Report sub-title
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...C.slateLight);
        doc.text('E-COMMERCE PROFIT & MARGIN ANALYSIS REPORT', ML, 22);

        // Website URL (right side)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...C.orange);
        doc.text('www.ecomprofit.filengro.in', MR, 14, { align: 'right' });

        // Generated date
        const today = new Date().toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...C.slateLight);
        doc.text(`Generated: ${today}`, MR, 22, { align: 'right' });

        // Bottom accent line
        doc.setFillColor(...C.orange);
        doc.rect(0, 36, PW, 2, 'F');

        let y = 48;

        // ══════════════════════════════════════════════════════════════════════
        // SECTION 1 — PRODUCT OVERVIEW
        // ══════════════════════════════════════════════════════════════════════
        sectionTitle(doc, 'PRODUCT OVERVIEW', y);
        y += 5;

        // Two-column info block
        const col1 = ML;
        const col2 = 110;

        const prodName = inputs.productName || 'Unnamed Product';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...C.navy);
        doc.text(prodName, col1, y);
        y += 5;

        // Row 1
        label(doc, 'MARKETPLACE', col1, y);
        label(doc, 'CATEGORY', col2, y);
        y += 4;
        value(doc, marketplaceName, col1, y, 9);
        value(doc, inputs.category || '—', col2, y, 9);
        y += 5;

        // Row 2
        label(doc, 'SKU / CODE', col1, y);
        label(doc, 'WEIGHT SLAB', col2, y);
        y += 4;
        value(doc, inputs.productSku || '—', col1, y, 9);
        value(doc, inputs.weightSlab || '—', col2, y, 9);
        y += 6;

        hLine(doc, y);
        y += 7;

        // ══════════════════════════════════════════════════════════════════════
        // SECTION 2 — PROFIT SUMMARY (highlight banner)
        // ══════════════════════════════════════════════════════════════════════
        sectionTitle(doc, 'PROFIT SUMMARY', y);
        y += 5;

        const isProfitable = results.isProfitable;
        const bannerFill   = isProfitable ? C.greenLight  : C.redLight;
        const bannerText   = isProfitable ? C.green       : C.red;
        const statusLabel  = isProfitable ? '✓  PROFITABLE PRODUCT' : '✗  LOSS MAKING PRODUCT';

        doc.setFillColor(...bannerFill);
        doc.setDrawColor(...bannerText);
        doc.setLineWidth(0.5);
        doc.roundedRect(ML, y, MR - ML, 26, 3, 3, 'FD');

        // Status pill
        doc.setFillColor(...bannerText);
        doc.roundedRect(ML + 4, y + 4, 55, 7, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...C.white);
        doc.text(statusLabel, ML + 6, y + 8.8);

        // Net profit (big)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...bannerText);
        doc.text(results.formatted.netProfit, ML + 4, y + 22);

        // Right-side mini metrics
        const mCol = MR - 60;
        label(doc, 'PROFIT MARGIN', mCol, y + 9);
        label(doc, 'ROI', mCol + 28, y + 9);
        label(doc, 'BREAK-EVEN PRICE', mCol, y + 19);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...C.navy);
        doc.text(results.formatted.profitMarginPct, mCol, y + 14);
        doc.text(results.formatted.roiPct, mCol + 28, y + 14);
        doc.text(results.formatted.breakEvenPrice, mCol, y + 24);

        y += 34;

        // ══════════════════════════════════════════════════════════════════════
        // SECTION 3 — UNIT ECONOMICS BREAKDOWN TABLE
        // ══════════════════════════════════════════════════════════════════════
        sectionTitle(doc, 'UNIT ECONOMICS BREAKDOWN', y);
        y += 5;

        // Table header row
        doc.setFillColor(...C.navyMid);
        doc.rect(ML, y, MR - ML, 7.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...C.white);
        doc.text('Cost Component', ML + 4, y + 5);
        doc.text('Amount', MR - 4, y + 5, { align: 'right' });
        y += 7.5;

        const tableRows = [
            { label: 'Gross Selling Price',                        val: results.formatted.sellingPrice,               highlight: false },
            { label: `Less: Product Sourcing Cost`,                val: `- ${results.formatted.productCost}`,          highlight: false },
            { label: `Less: GST Collected (${inputs.gstRate}%)`,   val: `- ${results.formatted.gstAmount}`,            highlight: false },
            { label: `Less: Commission (${inputs.commissionRate}%)`, val: `- ${results.formatted.commissionAmount}`,   highlight: false },
            { label: 'Less: Closing Fee',                          val: `- ${results.formatted.closingFee}`,           highlight: false },
            { label: 'Less: Shipping Fee',                         val: `- ${results.formatted.shippingFee}`,          highlight: false },
            { label: 'Less: Packaging Cost',                       val: `- ${results.formatted.packagingCost}`,        highlight: false },
            { label: 'Less: Advertising / CAC',                    val: `- ${results.formatted.advertisingCost}`,      highlight: false },
            { label: `Less: Payment Gateway (${inputs.paymentGatewayRate}%)`, val: `- ${results.formatted.pgAmount}`, highlight: false },
            { label: 'Less: GST on Marketplace Fees (18%)',        val: `- ${results.formatted.gstOnMarketplaceFees}`, highlight: false },
            { label: 'Less: Misc / Overhead Charges',              val: `- ${results.formatted.miscCharges}`,          highlight: false },
            { label: `Less: Return & RTO Risk (${inputs.returnRate}%)`, val: `- ${results.formatted.returnCostPerUnitSold}`, highlight: false },
        ];

        const ROW_H = 6.5;
        tableRows.forEach((row, i) => {
            const even = i % 2 === 0;
            doc.setFillColor(...(even ? C.white : C.muted));
            doc.rect(ML, y, MR - ML, ROW_H, 'F');

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...C.slate);
            doc.text(row.label, ML + 4, y + 4.3);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...C.navy);
            doc.text(row.val, MR - 4, y + 4.3, { align: 'right' });
            y += ROW_H;
        });

        // Totals separator
        hLine(doc, y, ML, MR, 0.5);
        y += 2;

        // Total Expenses row
        doc.setFillColor(...C.muted);
        doc.rect(ML, y, MR - ML, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...C.slate);
        doc.text('Total Deductions', ML + 4, y + 4.7);
        doc.setTextColor(...C.red);
        doc.text(`- ${results.formatted.totalExpenses}`, MR - 4, y + 4.7, { align: 'right' });
        y += 8;

        // Net Profit row
        doc.setFillColor(...bannerFill);
        doc.rect(ML, y, MR - ML, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(...bannerText);
        doc.text('NET PROFIT PER UNIT', ML + 4, y + 5.5);
        doc.text(results.formatted.netProfit, MR - 4, y + 5.5, { align: 'right' });
        y += 14;

        // ══════════════════════════════════════════════════════════════════════
        // SECTION 4 — TARGET SELLING PRICE RECOMMENDATIONS
        // ══════════════════════════════════════════════════════════════════════
        // Check page space (need ~36 mm)
        if (y > 230) { doc.addPage(); y = 20; }

        sectionTitle(doc, 'TARGET SELLING PRICE RECOMMENDATIONS', y);
        y += 5;

        const targets = [
            { pct: '20% Margin', price: results.formatted.target20Price, profit: results.formatted.target20Profit },
            { pct: '30% Margin', price: results.formatted.target30Price, profit: results.formatted.target30Profit },
            { pct: '40% Margin', price: results.formatted.target40Price, profit: results.formatted.target40Profit },
        ];

        const cardW = 58;
        const gap   = 4;
        targets.forEach((t, i) => {
            const cx = ML + i * (cardW + gap);
            doc.setFillColor(...C.muted);
            doc.setDrawColor(...C.border);
            doc.setLineWidth(0.3);
            doc.roundedRect(cx, y, cardW, 22, 2.5, 2.5, 'FD');

            // badge strip
            doc.setFillColor(...C.navy);
            doc.roundedRect(cx, y, cardW, 7.5, 2.5, 2.5, 'F');
            doc.rect(cx, y + 5, cardW, 2.5, 'F'); // square bottom corners on badge
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(...C.white);
            doc.text(t.pct, cx + cardW / 2, y + 5, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(...C.navy);
            doc.text(t.price, cx + cardW / 2, y + 14.5, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...C.green);
            doc.text(`Net Profit: ${t.profit}`, cx + cardW / 2, y + 19.5, { align: 'center' });
        });
        y += 30;

        // ══════════════════════════════════════════════════════════════════════
        // FOOTER
        // ══════════════════════════════════════════════════════════════════════
        const footerY = 277;

        doc.setFillColor(...C.muted);
        doc.rect(0, footerY - 2, PW, 22, 'F');

        hLine(doc, footerY - 2, 0, PW, 0.5);

        // Disclaimer
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.5);
        doc.setTextColor(...C.slateLight);
        doc.text(
            'Disclaimer: All figures are estimates based on standard marketplace fee slabs at the time of calculation. Actual charges may vary due to',
            PW / 2, footerY + 2, { align: 'center' }
        );
        doc.text(
            'tier changes, fulfillment mode, GST filing category, seller agreement terms or platform policy updates. Always verify with the marketplace.',
            PW / 2, footerY + 6.5, { align: 'center' }
        );

        // Branding line
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...C.orange);
        doc.text('Filengro', PW / 2 - 1, footerY + 13, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...C.slateLight);
        doc.text('  •  www.ecomprofit.filengro.in  •  Profit Calculator', PW / 2 - 1, footerY + 13);

        // ── Save ─────────────────────────────────────────────────────────────
        const cleanName = (inputs.productName || 'Product')
            .replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`filengro_profit_report_${cleanName}.pdf`);
    }

    return { export: generatePDF };

})();
