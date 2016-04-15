import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export default class Steps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastStepOffsetWidth: 0,
    };
  }
  componentDidMount() {
    this.culcLastStepOffsetWidth();
  }
  componentDidUpdate() {
    this.culcLastStepOffsetWidth();
  }
  culcLastStepOffsetWidth = () => {
    const domNode = ReactDOM.findDOMNode(this);
    if (domNode.children.length > 0) {
      setTimeout(() => {
        const lastStepOffsetWidth = domNode.lastChild.offsetWidth;
        if (this.state.lastStepOffsetWidth === lastStepOffsetWidth) {
          return;
        }
        this.setState({ lastStepOffsetWidth });
      });
    }
  }
  render() {
    const props = this.props;
    const { prefixCls, className, children, direction,
            iconPrefix, status, size, ...restProps } = props;
    const lastIndex = children.length - 1;
    const classString = classNames({
      [prefixCls]: true,
      [`${prefixCls}-${size}`]: size,
      [`${prefixCls}-${direction}`]: true,
      [`${prefixCls}-hidden`]: this.state.lastStepOffsetWidth === 0,
      [className]: className,
    });

    return (
      <div className={classString} {...restProps}>
        {
          React.Children.map(children, (ele, idx) => {
            const tailWidth = (props.direction === 'vertical' || idx === lastIndex)
              ? null : `${100 / lastIndex}%`;
            const adjustMarginRight = (props.direction === 'vertical' || idx === lastIndex)
              ? null : -((this.state.lastStepOffsetWidth + 1) / lastIndex);
            const np = {
              stepNumber: (idx + 1).toString(),
              stepLast: idx === lastIndex,
              tailWidth,
              adjustMarginRight,
              prefixCls,
              iconPrefix,
            };

            // fix tail color
            if (props.status === 'error' && idx === props.current - 1) {
              np.className = `${props.prefixCls}-next-error`;
            }

            if (!ele.props.status) {
              if (idx === props.current) {
                np.status = status;
              } else if (idx < props.current) {
                np.status = 'finish';
              } else {
                np.status = 'wait';
              }
            }
            return React.cloneElement(ele, np);
          }, this)
        }
      </div>
    );
  }
}

Steps.propTypes = {
  prefixCls: PropTypes.string,
  iconPrefix: PropTypes.string,
  direction: PropTypes.string,
  children: PropTypes.any,
  status: PropTypes.string,
  size: PropTypes.string,
};

Steps.defaultProps = {
  prefixCls: 'rc-steps',
  iconPrefix: 'rc',
  direction: 'horizontal',
  current: 0,
  status: 'process',
  size: '',
};
