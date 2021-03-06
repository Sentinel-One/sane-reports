/* eslint-disable react/prop-types */
import './SectionMarkdown.less';
import '../../../assets/styles/railscasts.css';
import React, { PropTypes } from 'react';
import { mdReact } from 'react-markdown-js';
import Highlight from 'react-highlight';


// plugins for react markdown component
import abbr from 'markdown-it-abbr';
import container from 'markdown-it-container';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import mark from 'markdown-it-mark';
import footnote from 'markdown-it-footnote';
import deflist from 'markdown-it-deflist';
import ins from 'markdown-it-ins';
// end of import plugin

function handleIterate(tableClasses, Tag, props, children) {
  let res = '';
  switch (Tag) {
    case 'p':
      res = (<div {...props}>{children}</div>);
      break;
    case 'hr':
      res = (<hr {...props} />);
      break;
    case 'img': {
      const srcArr = props.src.split('=size=');
      props.src = srcArr[0];
      if (srcArr.length > 1) {
        const sizeArr = srcArr[1].split('x');
        props.height = sizeArr[0];
        if (sizeArr.length > 1) {
          props.width = sizeArr[1];
        }
      }

      res = (<img {...props} />); // eslint-disable-line jsx-a11y/img-has-alt
      break;
    }
    case 'mark': {
      props.className = 'highlight-result';
      break;
    }
    case 'table': {
      const thead = children[0];
      const tbody = children[1];

      const headerRows = thead.props.children;
      const headerCells = headerRows[0].props.children;

      const bodyRows = tbody.props.children;
      const headersValues = headerCells.map(cell => cell.props.children[0]);
      const tableContent = [];
      if (headersValues && bodyRows) {
        bodyRows.forEach((row) => {
          const newRow = {};
          const cells = row.props.children;
          const cellValue = cells.map(cell => cell.props.children[0]);
          headersValues.forEach((headerValue, i) => {
            newRow[i] = cellValue[i] ? cellValue[i].replace(/<br>/g, '\n') : cellValue[i];
          });
          tableContent.push(newRow);
        });
      }

      res = (
        <table
          className={`ui very compact table celled fixed selectable ${tableClasses}`}
          style={{ tableLayout: 'fixed' }}
          key={Math.random()}
        >
          <thead>
            <tr>
              {headersValues.map((col, i) => {
                return <th key={i}>{col}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {tableContent.map((row, i) => {
              return (
                <tr key={i}>
                  {Object.keys(row).map((key, j) =>
                    <td key={j + '.' + i} style={{ wordBreak: 'break-word' }}>{row[key]}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
      break;
    }
    case 'blockquote':
      props.className = 'markdown blockquote';
      break;
    case 'br':
      res = <span {...props}><br /><br /></span>;
      break;
    case 'code': {
      const clzz = props['data-language'] || '';
      res = (
        <Highlight className={clzz} key={new Date().getMilliseconds()}>
          {children[0]}
        </Highlight>
      );
      break;
    }
    default:
      // Do nothing - will be set after switch
  }
  if (!res) {
    res = (<Tag {...props}>{children}</Tag>);
  }
  return res;
}

const SectionMarkdown = ({ text, style, tableClasses }) => {
  let res = text;
  try {
    const mdData = mdReact(
      {
        onIterate: handleIterate.bind(this, tableClasses),
        markdownOptions: { typographer: true },
        plugins: [
          emoji,
          abbr,
          sub,
          sup,
          mark,
          container,
          footnote,
          deflist,
          ins
        ]
      }
    )(text);

    if (mdData) {
      res = mdData;
    }
  } catch (ignored) {
    // do nothing
  }

  return (
    <div className="section-markdown" style={style}>
      {res}
    </div>
  );
};
SectionMarkdown.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object,
  tableClasses: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ])
};

export default SectionMarkdown;
