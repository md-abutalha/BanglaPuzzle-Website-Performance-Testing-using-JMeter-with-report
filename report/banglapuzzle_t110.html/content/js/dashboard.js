/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0472027972027972, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "news"], "isController": true}, {"data": [0.06363636363636363, 500, 1500, "https://www.banglapuzzle.com/about"], "isController": false}, {"data": [0.1318181818181818, 500, 1500, "hire"], "isController": true}, {"data": [0.00909090909090909, 500, 1500, "https://www.banglapuzzle.com/services"], "isController": false}, {"data": [0.0, 500, 1500, "products"], "isController": true}, {"data": [0.06363636363636363, 500, 1500, "https://www.banglapuzzle.com/industry/healthcare"], "isController": false}, {"data": [0.06363636363636363, 500, 1500, "healthcare"], "isController": true}, {"data": [0.05, 500, 1500, "https://www.banglapuzzle.com/news"], "isController": false}, {"data": [0.1318181818181818, 500, 1500, "https://www.banglapuzzle.com/hire"], "isController": false}, {"data": [0.00909090909090909, 500, 1500, "service"], "isController": true}, {"data": [0.045454545454545456, 500, 1500, "contact"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/products"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "https://www.banglapuzzle.com/contact"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 770, 0, 0.0, 7815.487012987024, 760, 164942, 4958.5, 16443.199999999997, 21540.199999999983, 43889.44999999992, 2.3086517473795305, 374.4059982642012, 2.6468331556870788], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["news", 110, 0, 0.0, 12802.481818181817, 1795, 76192, 8656.5, 25568.800000000003, 43147.29999999995, 74304.40000000001, 0.7552247823579491, 211.75033883202772, 1.8740489960659656], "isController": true}, {"data": ["https://www.banglapuzzle.com/about", 110, 0, 0.0, 5472.745454545454, 895, 74480, 3127.5, 10337.100000000008, 17553.799999999956, 71287.25000000001, 0.7669727585221132, 111.06974832834801, 0.9519749766421933], "isController": false}, {"data": ["hire", 110, 0, 0.0, 4060.4727272727278, 807, 20605, 2366.5, 8563.2, 13284.44999999996, 20449.46, 0.5560020420438635, 89.88524283705097, 0.6895728451129948], "isController": true}, {"data": ["https://www.banglapuzzle.com/services", 110, 0, 0.0, 12042.218181818178, 952, 131806, 9785.5, 19559.000000000004, 25112.099999999988, 121267.23000000005, 0.7350337113188509, 140.7949765457425, 0.9144853009963049], "isController": false}, {"data": ["products", 110, 0, 0.0, 11879.581818181812, 1861, 42964, 12908.0, 21693.20000000001, 22948.899999999998, 42345.36, 2.1209316674379144, 293.94380615648623, 1.1909528406023446], "isController": true}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 110, 0, 0.0, 6354.518181818183, 887, 28381, 3657.5, 16285.800000000001, 22389.149999999994, 28252.08, 0.759374827414812, 140.18593923663846, 0.9529264191680014], "isController": false}, {"data": ["healthcare", 110, 0, 0.0, 6354.518181818183, 887, 28381, 3657.5, 16285.800000000001, 22389.149999999994, 28252.08, 0.7593853121073633, 140.187874784697, 0.9529395762284782], "isController": true}, {"data": ["https://www.banglapuzzle.com/news", 110, 0, 0.0, 7329.7363636363625, 821, 55295, 5043.0, 18801.300000000003, 22014.899999999972, 54668.770000000004, 0.7603143554262254, 103.07184954458899, 0.9429679994055724], "isController": false}, {"data": ["https://www.banglapuzzle.com/hire", 110, 0, 0.0, 4060.4727272727278, 807, 20605, 2366.5, 8563.2, 13284.44999999996, 20449.46, 0.5559992317101525, 89.88478850863315, 0.6895693596405211], "isController": false}, {"data": ["service", 110, 0, 0.0, 12042.218181818178, 952, 131806, 9785.5, 19559.000000000004, 25112.099999999988, 121267.23000000005, 0.7350386229385508, 140.79591736161228, 0.914491411741908], "isController": true}, {"data": ["contact", 110, 0, 0.0, 7569.136363636363, 760, 164942, 4355.5, 12309.100000000002, 20196.14999999997, 151950.45000000007, 0.5507242023260588, 98.26807505776347, 0.6846405366807352], "isController": true}, {"data": ["https://www.banglapuzzle.com/products", 110, 0, 0.0, 11879.581818181812, 1861, 42964, 12908.0, 21693.20000000001, 22948.899999999998, 42345.36, 2.1251521415737717, 294.5287294005139, 1.1933227357469909], "isController": false}, {"data": ["https://www.banglapuzzle.com/contact", 110, 0, 0.0, 7569.136363636363, 760, 164942, 4355.5, 12309.100000000002, 20196.14999999997, 151950.45000000007, 0.5507297168748592, 98.26905904229353, 0.6846473921696247], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 770, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
