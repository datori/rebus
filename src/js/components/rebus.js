import { createComponent } from '../mini';
import { connect } from '../store';
import { Word } from './word';

export function Rebus(props, ...children) {
  return connect(
    createComponent({
      props,
      children,
      componentDidMount() {
        this.$element.querySelector('input').focus();
      },
      componentDidUpdate({ current }) {
        /* If history API isn't available, we shouldn't revert to the more widely available `window.location.href`, 
        as it incurs a new HTTP request and thus results in an infinite loop (and breaks SPAs). */
        if (window.history) {
          window.history.pushState('', '', `/?rebus=${current + 1}`);
        }
        this.$element.querySelector('input').focus();
      },
      render({ current, rebuses, animation }) {
        const rebus = rebuses[current];
        this.children = rebus.words.map((word, wordIndex) =>
          Word({ word, wordIndex, current, rebuses, charInput: props.charInput })
        );
        return `
          <div class="rebus ${rebus.isAnswered ? 'rebus--answered' : ''} animation--${animation}">
            <div class="rebus__header">
              <span>${current + 1}/${rebuses.length}</span>
            </div>
            <span class="rebus__symbols">${rebus.symbols.join(' ')}</span>
            <div class="rebus__words">
              <children>
            </div>
          </div>
        `;
      }
    })
  );
}
