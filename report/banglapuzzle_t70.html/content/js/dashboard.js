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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18076923076923077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02857142857142857, 500, 1500, "news"], "isController": true}, {"data": [0.32857142857142857, 500, 1500, "https://www.banglapuzzle.com/about"], "isController": false}, {"data": [0.35, 500, 1500, "hire"], "isController": true}, {"data": [0.07857142857142857, 500, 1500, "https://www.banglapuzzle.com/services"], "isController": false}, {"data": [0.0, 500, 1500, "products"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "https://www.banglapuzzle.com/industry/healthcare"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "healthcare"], "isController": true}, {"data": [0.25, 500, 1500, "https://www.banglapuzzle.com/news"], "isController": false}, {"data": [0.35, 500, 1500, "https://www.banglapuzzle.com/hire"], "isController": false}, {"data": [0.07857142857142857, 500, 1500, "service"], "isController": true}, {"data": [0.22857142857142856, 500, 1500, "contact"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/products"], "isController": false}, {"data": [0.22857142857142856, 500, 1500, "https://www.banglapuzzle.com/contact"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 490, 0, 0.0, 3673.0061224489796, 614, 22960, 2154.5, 8848.1, 12572.5, 16648.059999999983, 2.9568659634555505, 479.72127153910907, 3.3900006260711093], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["news", 70, 0, 0.0, 4102.185714285716, 1351, 13278, 3014.0, 8701.699999999999, 11299.750000000002, 13278.0, 1.869009158144875, 524.2786844928977, 4.637844014498171], "isController": true}, {"data": ["https://www.banglapuzzle.com/about", 70, 0, 0.0, 1671.5285714285715, 614, 6506, 1161.0, 2972.6, 4838.150000000002, 6506.0, 2.003950645558387, 290.295287495348, 2.487325459477255], "isController": false}, {"data": ["hire", 70, 0, 0.0, 1530.4714285714285, 758, 4800, 1123.5, 2826.7999999999997, 3878.1500000000005, 4800.0, 1.8794469056249161, 303.89951146966035, 2.3309546583434018], "isController": true}, {"data": ["https://www.banglapuzzle.com/services", 70, 0, 0.0, 4707.171428571429, 764, 22960, 3120.5, 9378.4, 13434.350000000002, 22960.0, 1.8871993960961932, 361.70248448958, 2.3479414361587403], "isController": false}, {"data": ["products", 70, 0, 0.0, 9694.22857142857, 3706, 17547, 8827.5, 15746.8, 16912.300000000003, 17547.0, 3.1808061071477254, 440.9496303732903, 1.786097179306584], "isController": true}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 70, 0, 0.0, 3409.257142857143, 790, 13134, 2241.5, 8654.199999999999, 11792.400000000005, 13134.0, 1.8772292096865029, 346.7325893276167, 2.355702670358551], "isController": false}, {"data": ["healthcare", 70, 0, 0.0, 3409.257142857143, 790, 13134, 2241.5, 8654.199999999999, 11792.400000000005, 13134.0, 1.8773299005015152, 346.75118736925737, 2.3558290255316865], "isController": true}, {"data": ["https://www.banglapuzzle.com/news", 70, 0, 0.0, 2430.6571428571424, 675, 10617, 1573.5, 5208.0, 7734.200000000005, 10617.0, 1.9046582498911622, 258.367024456152, 2.3622226341423596], "isController": false}, {"data": ["https://www.banglapuzzle.com/hire", 70, 0, 0.0, 1530.4714285714285, 758, 4800, 1123.5, 2826.7999999999997, 3878.1500000000005, 4800.0, 1.8794469056249161, 303.89951146966035, 2.3309546583434018], "isController": false}, {"data": ["service", 70, 0, 0.0, 4707.171428571429, 764, 22960, 3120.5, 9378.4, 13434.350000000002, 22960.0, 1.8870976438237992, 361.6829825494015, 2.3478148420229688], "isController": true}, {"data": ["contact", 70, 0, 0.0, 2267.728571428571, 664, 7699, 1663.5, 5135.599999999999, 6040.200000000004, 7699.0, 1.9036223213314478, 339.75265869751445, 2.366514858452083], "isController": true}, {"data": ["https://www.banglapuzzle.com/products", 70, 0, 0.0, 9694.22857142857, 3706, 17547, 8827.5, 15746.8, 16912.300000000003, 17547.0, 3.1986839700237617, 443.42800747692377, 1.7961360183238895], "isController": false}, {"data": ["https://www.banglapuzzle.com/contact", 70, 0, 0.0, 2267.728571428571, 664, 7699, 1663.5, 5135.599999999999, 6040.200000000004, 7699.0, 1.9035705544829087, 339.74341950955863, 2.36645050376635], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 490, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
