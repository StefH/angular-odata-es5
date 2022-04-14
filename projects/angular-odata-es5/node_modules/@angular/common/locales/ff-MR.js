/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(null, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/common/locales/ff-MR", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // **Note**: Locale files are generated through Bazel and never part of the sources. This is an
    // exception for backwards compatibility. With the Gulp setup we never deleted old locale files
    // when updating CLDR, so older locale files which have been removed, or renamed in the CLDR
    // data remained in the repository. We keep these files checked-in until the next major to avoid
    // potential breaking changes. It's worth noting that the locale data for such files is outdated
    // anyway. e.g. the data is missing the directionality, throwing off the indices.
    var u = undefined;
    function plural(n) {
        var i = Math.floor(Math.abs(n));
        if (i === 0 || i === 1)
            return 1;
        return 5;
    }
    exports.default = [
        'ff-MR', [['subaka', 'kikiiɗe'], u, u], u,
        [
            ['d', 'a', 'm', 'n', 'n', 'm', 'h'], ['dew', 'aaɓ', 'maw', 'nje', 'naa', 'mwd', 'hbi'],
            ['dewo', 'aaɓnde', 'mawbaare', 'njeslaare', 'naasaande', 'mawnde', 'hoore-biir'],
            ['dew', 'aaɓ', 'maw', 'nje', 'naa', 'mwd', 'hbi']
        ],
        u,
        [
            ['s', 'c', 'm', 's', 'd', 'k', 'm', 'j', 's', 'y', 'j', 'b'],
            ['sii', 'col', 'mbo', 'see', 'duu', 'kor', 'mor', 'juk', 'slt', 'yar', 'jol', 'bow'],
            [
                'siilo', 'colte', 'mbooy', 'seeɗto', 'duujal', 'korse', 'morso', 'juko', 'siilto', 'yarkomaa',
                'jolal', 'bowte'
            ]
        ],
        u, [['H-I', 'C-I'], u, ['Hade Iisa', 'Caggal Iisa']], 1, [6, 0],
        ['d/M/y', 'd MMM, y', 'd MMMM y', 'EEEE d MMMM y'],
        ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'], ['{1} {0}', u, u, u],
        [',', ' ', ';', '%', '+', '-', 'E', '×', '‰', '∞', 'NaN', ':'],
        ['#,##0.###', '#,##0%', '#,##0.00 ¤', '#E0'], 'UM', 'Ugiyya Muritani',
        { 'JPY': ['JP¥', '¥'], 'MRU': ['UM'], 'USD': ['US$', '$'] }, plural
    ];
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmYtTVIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vbG9jYWxlcy9mZi1NUi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILCtGQUErRjtJQUMvRiwrRkFBK0Y7SUFDL0YsNEZBQTRGO0lBQzVGLGdHQUFnRztJQUNoRyxnR0FBZ0c7SUFDaEcsaUZBQWlGO0lBRWpGLElBQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVwQixTQUFTLE1BQU0sQ0FBQyxDQUFTO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELGtCQUFlO1FBQ2IsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDekM7WUFDRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1lBQ3RGLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDO1lBQ2hGLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1NBQ2xEO1FBQ0QsQ0FBQztRQUNEO1lBQ0UsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUM1RCxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1lBQ3BGO2dCQUNFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVU7Z0JBQzdGLE9BQU8sRUFBRSxPQUFPO2FBQ2pCO1NBQ0Y7UUFDRCxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9ELENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDO1FBQ2xELENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5RSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDO1FBQzlELENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLGlCQUFpQjtRQUNyRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUMsRUFBRSxNQUFNO0tBQ2xFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gKipOb3RlKio6IExvY2FsZSBmaWxlcyBhcmUgZ2VuZXJhdGVkIHRocm91Z2ggQmF6ZWwgYW5kIG5ldmVyIHBhcnQgb2YgdGhlIHNvdXJjZXMuIFRoaXMgaXMgYW5cbi8vIGV4Y2VwdGlvbiBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFdpdGggdGhlIEd1bHAgc2V0dXAgd2UgbmV2ZXIgZGVsZXRlZCBvbGQgbG9jYWxlIGZpbGVzXG4vLyB3aGVuIHVwZGF0aW5nIENMRFIsIHNvIG9sZGVyIGxvY2FsZSBmaWxlcyB3aGljaCBoYXZlIGJlZW4gcmVtb3ZlZCwgb3IgcmVuYW1lZCBpbiB0aGUgQ0xEUlxuLy8gZGF0YSByZW1haW5lZCBpbiB0aGUgcmVwb3NpdG9yeS4gV2Uga2VlcCB0aGVzZSBmaWxlcyBjaGVja2VkLWluIHVudGlsIHRoZSBuZXh0IG1ham9yIHRvIGF2b2lkXG4vLyBwb3RlbnRpYWwgYnJlYWtpbmcgY2hhbmdlcy4gSXQncyB3b3J0aCBub3RpbmcgdGhhdCB0aGUgbG9jYWxlIGRhdGEgZm9yIHN1Y2ggZmlsZXMgaXMgb3V0ZGF0ZWRcbi8vIGFueXdheS4gZS5nLiB0aGUgZGF0YSBpcyBtaXNzaW5nIHRoZSBkaXJlY3Rpb25hbGl0eSwgdGhyb3dpbmcgb2ZmIHRoZSBpbmRpY2VzLlxuXG5jb25zdCB1ID0gdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBwbHVyYWwobjogbnVtYmVyKTogbnVtYmVyIHtcbiAgbGV0IGkgPSBNYXRoLmZsb29yKE1hdGguYWJzKG4pKTtcbiAgaWYgKGkgPT09IDAgfHwgaSA9PT0gMSkgcmV0dXJuIDE7XG4gIHJldHVybiA1O1xufVxuXG5leHBvcnQgZGVmYXVsdCBbXG4gICdmZi1NUicsIFtbJ3N1YmFrYScsICdraWtpacmXZSddLCB1LCB1XSwgdSxcbiAgW1xuICAgIFsnZCcsICdhJywgJ20nLCAnbicsICduJywgJ20nLCAnaCddLCBbJ2RldycsICdhYcmTJywgJ21hdycsICduamUnLCAnbmFhJywgJ213ZCcsICdoYmknXSxcbiAgICBbJ2Rld28nLCAnYWHJk25kZScsICdtYXdiYWFyZScsICduamVzbGFhcmUnLCAnbmFhc2FhbmRlJywgJ21hd25kZScsICdob29yZS1iaWlyJ10sXG4gICAgWydkZXcnLCAnYWHJkycsICdtYXcnLCAnbmplJywgJ25hYScsICdtd2QnLCAnaGJpJ11cbiAgXSxcbiAgdSxcbiAgW1xuICAgIFsncycsICdjJywgJ20nLCAncycsICdkJywgJ2snLCAnbScsICdqJywgJ3MnLCAneScsICdqJywgJ2InXSxcbiAgICBbJ3NpaScsICdjb2wnLCAnbWJvJywgJ3NlZScsICdkdXUnLCAna29yJywgJ21vcicsICdqdWsnLCAnc2x0JywgJ3lhcicsICdqb2wnLCAnYm93J10sXG4gICAgW1xuICAgICAgJ3NpaWxvJywgJ2NvbHRlJywgJ21ib295JywgJ3NlZcmXdG8nLCAnZHV1amFsJywgJ2tvcnNlJywgJ21vcnNvJywgJ2p1a28nLCAnc2lpbHRvJywgJ3lhcmtvbWFhJyxcbiAgICAgICdqb2xhbCcsICdib3d0ZSdcbiAgICBdXG4gIF0sXG4gIHUsIFtbJ0gtSScsICdDLUknXSwgdSwgWydIYWRlIElpc2EnLCAnQ2FnZ2FsIElpc2EnXV0sIDEsIFs2LCAwXSxcbiAgWydkL00veScsICdkIE1NTSwgeScsICdkIE1NTU0geScsICdFRUVFIGQgTU1NTSB5J10sXG4gIFsnaDptbSBhJywgJ2g6bW06c3MgYScsICdoOm1tOnNzIGEgeicsICdoOm1tOnNzIGEgenp6eiddLCBbJ3sxfSB7MH0nLCB1LCB1LCB1XSxcbiAgWycsJywgJ8KgJywgJzsnLCAnJScsICcrJywgJy0nLCAnRScsICfDlycsICfigLAnLCAn4oieJywgJ05hTicsICc6J10sXG4gIFsnIywjIzAuIyMjJywgJyMsIyMwJScsICcjLCMjMC4wMMKgwqQnLCAnI0UwJ10sICdVTScsICdVZ2l5eWEgTXVyaXRhbmknLFxuICB7J0pQWSc6IFsnSlDCpScsICfCpSddLCAnTVJVJzogWydVTSddLCAnVVNEJzogWydVUyQnLCAnJCddfSwgcGx1cmFsXG5dO1xuIl19