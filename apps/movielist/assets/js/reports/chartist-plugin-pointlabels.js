import { LineChart, BarChart, noop, extend } from "chartist";

/**
 * Chartist.js plugin to display a data label on top of the points in a line chart.
 * based off of: https://github.com/gionkunz/chartist-plugin-pointlabels/blob/master/src/scripts/chartist-plugin-pointlabels.js
 *
 */
const defaultOptions = {
    labelClass: 'ct-label',
    labelOffset: {
        x: 0,
        y: -10
    },
    textAnchor: 'middle',
    align: 'center',
    labelInterpolationFnc: noop
};

const labelPositionCalculation = {
    point: function(data) {
        return {
        x: data.x,
        y: data.y
        };
    },
    bar: {
        left: function(data) {
            return {
                x: data.x1,
                y: data.y1
            };
        },
        center: function(data) {
            return {
                x: data.x1 + (data.x2 - data.x1) / 2,
                y: data.y1
            };
        },
        right: function(data) {
            return {
                x: data.x2,
                y: data.y1
            };
        }
    }
};

export default function(options) {
    options = extend({}, defaultOptions, options);

    function addLabel(position, data) {
        // if x and y exist concat them otherwise output only the existing value
        const value = data.value.x !== undefined && data.value.y ? (data.value.x + ', ' + data.value.y) : data.value.y || data.value.x;

        data.group.elem('text', {
            x: position.x + options.labelOffset.x,
            y: position.y + options.labelOffset.y,
            style: 'text-anchor: ' + options.textAnchor
        }, options.labelClass).text(options.labelInterpolationFnc(value));
    }

    return function ctPointLabels(chart) {
        if (chart instanceof LineChart || chart instanceof BarChart) {
            chart.on('draw', function(data) {
                const positonCalculator = labelPositionCalculation[data.type] && labelPositionCalculation[data.type][options.align] || labelPositionCalculation[data.type];
                if (positonCalculator) {
                    addLabel(positonCalculator(data), data);
                }
        });
        }
    };
};