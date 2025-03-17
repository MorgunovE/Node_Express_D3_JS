document.addEventListener('DOMContentLoaded', function() {
    // Dimensions for the map
    const width = 960;
    const height = 600;

    // Create SVG
    const svg = d3.select('#county-map')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Define projection and path
    const projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale(1200);

    const path = d3.geoPath()
        .projection(projection);

    // Create a group for counties
    const counties = svg.append('g')
        .attr('class', 'counties');

    // Create a group for state borders
    const states = svg.append('g')
        .attr('class', 'states');

    // Color scale for education levels
    const colorScale = d3.scaleQuantize()
        .domain([0, 100])
        .range(d3.schemeBlues[9]);

    // Tooltip element
    const tooltip = d3.select('#tooltip');

    // Education select dropdown
    const educationSelect = document.getElementById('education-select');

    // Selected education metric (default is bachelorsOrHigher)
    let selectedMetric = 'bachelorsOrHigher';

    // Promise to load data
    Promise.all([
        d3.json('/data/counties.json'),
        d3.json('/data/for_user_education.json')
    ]).then(function(data) {
        const [countyData, educationData] = data;

        // Extract features from TopoJSON
        const counties = topojson.feature(countyData, countyData.objects.counties).features;
        const states = topojson.mesh(countyData, countyData.objects.states, function(a, b) { return a !== b; });

        // Create map between county IDs and education data
        const educationById = {};
        educationData.forEach(function(d) {
            educationById[d.fips] = d;
        });

        // Draw the counties
        drawCounties();

        // Draw state borders
        drawStateBorders();

        // Create legend
        createLegend();

        // Add event listener for education select change
        educationSelect.addEventListener('change', function() {
            selectedMetric = this.value;
            updateCountyColors();
            createLegend();
        });

        // Function to draw counties
        function drawCounties() {
            d3.select('.counties')
                .selectAll('path')
                .data(counties)
                .enter()
                .append('path')
                .attr('class', 'county')
                .attr('d', path)
                .attr('data-fips', d => d.id)
                .attr('data-education', d => {
                    const countyEdu = educationById[d.id];
                    return countyEdu ? countyEdu[selectedMetric] : 0;
                })
                .attr('fill', d => {
                    const countyEdu = educationById[d.id];
                    return countyEdu ? colorScale(countyEdu[selectedMetric]) : '#ccc';
                })
                .on('mouseover', function(event, d) {
                    const countyEdu = educationById[d.id];

                    if (countyEdu) {
                        tooltip.style('opacity', 0.9)
                            .html(`
                                <strong>${countyEdu.area_name}, ${countyEdu.state}</strong><br/>
                                ${selectedMetric === 'bachelorsOrHigher' ? 'Licence ou plus' : 'Diplôme secondaire ou plus'}: 
                                ${countyEdu[selectedMetric]}%
                            `)
                            .style('left', (event.pageX + 15) + 'px')
                            .style('top', (event.pageY - 30) + 'px')
                            .attr('data-education', countyEdu[selectedMetric]);
                    }
                })
                .on('mouseout', function() {
                    tooltip.style('opacity', 0);
                });
        }

        // Function to update county colors when metric changes
        function updateCountyColors() {
            d3.selectAll('.county')
                .attr('data-education', d => {
                    const countyEdu = educationById[d.id];
                    return countyEdu ? countyEdu[selectedMetric] : 0;
                })
                .attr('fill', d => {
                    const countyEdu = educationById[d.id];
                    return countyEdu ? colorScale(countyEdu[selectedMetric]) : '#ccc';
                });
        }

        // Function to draw state borders
        function drawStateBorders() {
            d3.select('.states')
                .append('path')
                .datum(states)
                .attr('class', 'state-borders')
                .attr('d', path);
        }

        // Function to create legend
        function createLegend() {
            const legendContainer = d3.select('#legend');
            legendContainer.html(''); // Clear existing legend

            const title = selectedMetric === 'bachelorsOrHigher'
                ? 'Pourcentage de personnes ayant une licence ou plus'
                : 'Pourcentage de personnes ayant un diplôme d\'études secondaires ou plus';

            legendContainer.append('div')
                .attr('class', 'legend-title')
                .text(title);

            const legendScale = colorScale.range().map(d => {
                const [min, max] = colorScale.invertExtent(d);
                return { color: d, min: Math.round(min), max: Math.round(max) };
            });

            const legendItems = legendContainer.selectAll('.legend-item')
                .data(legendScale)
                .enter()
                .append('div')
                .attr('class', 'legend-item');

            legendItems.append('div')
                .attr('class', 'legend-color')
                .style('background-color', d => d.color);

            legendItems.append('div')
                .attr('class', 'legend-text')
                .text(d => `${d.min}% - ${d.max}%`);
        }
    }).catch(function(error) {
        console.error('Error loading data:', error);
    });
});
