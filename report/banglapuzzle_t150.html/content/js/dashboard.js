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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07051282051282051, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "news"], "isController": true}, {"data": [0.09333333333333334, 500, 1500, "https://www.banglapuzzle.com/about"], "isController": false}, {"data": [0.18333333333333332, 500, 1500, "hire"], "isController": true}, {"data": [0.013333333333333334, 500, 1500, "https://www.banglapuzzle.com/services"], "isController": false}, {"data": [0.0, 500, 1500, "products"], "isController": true}, {"data": [0.03333333333333333, 500, 1500, "https://www.banglapuzzle.com/industry/healthcare"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "healthcare"], "isController": true}, {"data": [0.09666666666666666, 500, 1500, "https://www.banglapuzzle.com/news"], "isController": false}, {"data": [0.18333333333333332, 500, 1500, "https://www.banglapuzzle.com/hire"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "service"], "isController": true}, {"data": [0.13333333333333333, 500, 1500, "contact"], "isController": true}, {"data": [0.0, 500, 1500, "https://www.banglapuzzle.com/products"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "https://www.banglapuzzle.com/contact"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1050, 0, 0.0, 15149.276190476206, 727, 303708, 4973.0, 31636.1, 53064.24999999998, 164463.49000000008, 2.2446209262802355, 364.0981337747309, 2.5734228197783167], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["news", 150, 0, 0.0, 13430.519999999995, 1588, 148179, 8218.0, 25147.000000000004, 51832.74999999991, 126665.16000000038, 0.45788943496443724, 128.43529461846364, 1.1362275920357765], "isController": true}, {"data": ["https://www.banglapuzzle.com/about", 150, 0, 0.0, 7809.739999999997, 727, 146421, 3642.0, 12481.500000000002, 39589.99999999998, 112262.7300000006, 0.4601170537784812, 66.6500371496592, 0.5711023196801266], "isController": false}, {"data": ["hire", 150, 0, 0.0, 4025.7866666666678, 752, 40840, 2023.0, 7461.800000000001, 14838.349999999999, 40612.030000000006, 0.4706975109515621, 76.10530623678125, 0.5837752333090663], "isController": true}, {"data": ["https://www.banglapuzzle.com/services", 150, 0, 0.0, 32763.673333333343, 828, 240520, 24838.5, 57769.30000000002, 97072.6999999999, 204361.00000000064, 0.5297040366978957, 101.4697879992019, 0.6590263112823428], "isController": false}, {"data": ["products", 150, 0, 0.0, 26738.213333333322, 1828, 280134, 18152.5, 31440.200000000008, 64640.74999999995, 268033.7400000002, 0.5179039391773614, 71.77579104971359, 0.29081520022166285], "isController": true}, {"data": ["https://www.banglapuzzle.com/industry/healthcare", 150, 0, 0.0, 23723.80666666668, 793, 303708, 5421.0, 54799.000000000015, 145599.29999999996, 301903.62000000005, 0.45856975151633733, 84.69067690914052, 0.5754512995102475], "isController": false}, {"data": ["healthcare", 150, 0, 0.0, 23723.80666666668, 793, 303708, 5421.0, 54799.000000000015, 145599.29999999996, 301903.62000000005, 0.45856975151633733, 84.69067690914052, 0.5754512995102475], "isController": true}, {"data": ["https://www.banglapuzzle.com/news", 150, 0, 0.0, 5620.779999999998, 759, 68870, 3375.0, 12649.800000000003, 18516.749999999993, 67442.51000000002, 0.45940962800071056, 62.31413650323425, 0.5697756128524438], "isController": false}, {"data": ["https://www.banglapuzzle.com/hire", 150, 0, 0.0, 4025.7866666666678, 752, 40840, 2023.0, 7461.800000000001, 14838.349999999999, 40612.030000000006, 0.4706989879971758, 76.10554505471876, 0.5837770651918098], "isController": false}, {"data": ["service", 150, 0, 0.0, 32763.673333333343, 828, 240520, 24838.5, 57769.30000000002, 97072.6999999999, 204361.00000000064, 0.529700295572765, 101.46907135151265, 0.6590216567965845], "isController": true}, {"data": ["contact", 150, 0, 0.0, 5362.940000000003, 771, 57871, 3149.5, 13441.300000000003, 17940.249999999964, 48979.660000000156, 0.4678829544001273, 83.49425237470093, 0.5816552743665644], "isController": true}, {"data": ["https://www.banglapuzzle.com/products", 150, 0, 0.0, 26738.20666666666, 1828, 280134, 18152.5, 31440.200000000008, 64640.74999999995, 268033.7400000002, 0.5183764449743403, 71.84127515745685, 0.2910805233010212], "isController": false}, {"data": ["https://www.banglapuzzle.com/contact", 150, 0, 0.0, 5362.940000000003, 771, 57871, 3149.5, 13441.300000000003, 17940.249999999964, 48979.660000000156, 0.46788149497495274, 83.49399193859679, 0.5816534600616357], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1050, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
