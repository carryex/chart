import * as d3 from 'd3';

interface Data {
  date: number;
  value: number;
}
type SvgNode = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
type ScaleTime = d3.ScaleTime<number, number, never>;
type ScaleLinear = d3.ScaleLinear<number, number, never>;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

class Chart {
  private svg: SvgNode;
  private height: number;
  private width: number;
  private xScale: ScaleTime;
  private yScale: ScaleLinear;
  private line: any;

  constructor(private root: string, private data: Data[]) {
    const container = document.getElementById(root);
    if (!container) {
      throw new Error('Container not found');
    }
    this.width = container.offsetWidth - margin.left - margin.right;
    this.height = container.offsetHeight - margin.top - margin.bottom;
    this.xScale = this.createXScale();
    this.yScale = this.createYScale();
    this.svg = this.appendSvg(root);
    this.appendAxis();
    this.line = this.createLine();
    this.appendLine();
  }

  // Add chart  svg container to root element
  private appendSvg = (root: string): SvgNode => {
    return d3
      .select(`#${root}`)
      .append('svg')
      .attr('width', this.width + margin['left'] + margin['right'])
      .attr('height', this.height + margin['top'] + margin['bottom'])
      .append('g')
      .attr('transform', `translate(${margin['left']},  ${margin['top']})`);
  };

  private appendAxis = () => {
    this.svg
      .append('g')
      .attr('id', 'xAxis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.svg
      .append('g')
      .attr('id', 'yAxis')
      .attr('transform', `translate(0, 0)`)
      .call(d3.axisLeft(this.yScale));
  };

  private createXScale = () => {
    const xMin = d3.min(this.data, (d) => {
      return d.date;
    });
    const xMax = d3.max(this.data, (d) => {
      return d.date;
    });

    if (!xMin || !xMax) {
      throw new Error('Cannot define xMin or xMax values');
    }
    return d3.scaleTime().domain([xMin, xMax]).range([0, this.width]);
  };

  private createYScale = () => {
    const yMin = d3.min(this.data, (d) => {
      return d.value;
    });
    const yMax = d3.max(this.data, (d) => {
      return d.value;
    });

    if (!yMin || !yMax) {
      throw new Error('Cannot define yMin or yMax values');
    }

    return (
      d3
        .scaleLinear()
        //TODO why need 5?
        .domain([yMin, yMax])
        .range([this.height, 0])
    );
  };

  private createLine = () => {
    return (
      d3
        .line()
        //@ts-ignore
        .x((d: Data) => {
          return this.xScale(d.date);
        })
        //@ts-ignore
        .y((d: Data) => {
          return this.yScale(d.value);
        })
    );
  };

  private appendLine = () => {
    this.svg
      .append('path')
      .data([this.data])
      .style('fill', 'none')
      .attr('id', 'priceChart')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '1.5')
      .attr('d', this.line);
  };
}

export { Chart };
