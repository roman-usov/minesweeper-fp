/// <reference types="cypress" />

import '../support/commands';
import {
  e2eStartingBoard,
  e2eStartingBoardToTestWinning,
} from '../../src/testHelpers';

describe('game operations', () => {
  beforeEach(() => {
    cy.visitApp(e2eStartingBoard);
  });

  describe('marking a tile', () => {
    describe('a user right-clicks on a hidden tile', () => {
      it('it should mark the tile and decrement the mine counter', () => {
        cy.getTile('2', '2').rightclick();
        cy.getTile('2', '2').should('have.attr', 'data-status', 'marked');
        cy.get('[data-mine-count]').should('have.text', '0');
      });
    });

    describe('a user right-clicks on a marked tile', () => {
      it('it should unmark the tile and increment the mine counter', () => {
        cy.getTile('2', '2').rightclick();
        cy.getTile('2', '2').rightclick();
        cy.getTile('2', '2').should('have.attr', 'data-status', 'hidden');
        cy.get('[data-mine-count]').should('have.text', '1');
      });
    });
  });

  describe('a user clicks on a hidden tile next to a mine', () => {
    it('it should reveal the tile and show the number of mines around the tile', () => {
      cy.getTile('0', '1').click();
      cy.getTile('0', '1').should('have.attr', 'data-status', 'number');
      cy.getTile('0', '1').should('have.text', '1');
    });
  });

  describe('a user clicks on a hidden tile with to mines nearby', () => {
    it('it should reveal the tile and all nearby tiles up to the mine or mines', () => {
      cy.getTile('2', '2').click();
      cy.getTile('0', '1').should('have.attr', 'data-status', 'number');
      cy.getTile('0', '1').should('have.text', '1');
      cy.getTile('0', '2').should('have.attr', 'data-status', 'number');
      cy.getTile('0', '2').should('have.text', '');
      cy.getTile('1', '0').should('have.attr', 'data-status', 'number');
      cy.getTile('1', '0').should('have.text', '1');
      cy.getTile('1', '1').should('have.attr', 'data-status', 'number');
      cy.getTile('1', '1').should('have.text', '1');
      cy.getTile('1', '2').should('have.attr', 'data-status', 'number');
      cy.getTile('1', '2').should('have.text', '');
      cy.getTile('2', '0').should('have.attr', 'data-status', 'number');
      cy.getTile('2', '0').should('have.text', '');
      cy.getTile('2', '1').should('have.attr', 'data-status', 'number');
      cy.getTile('2', '1').should('have.text', '');
      cy.getTile('2', '2').should('have.attr', 'data-status', 'number');
      cy.getTile('2', '2').should('have.text', '');
    });
  });
});

describe('winning a game', () => {
  describe('when all safe tiles in every row are numbers and all mines are either marked or hidden', () => {
    it('the user wins the game', () => {
      cy.visitApp(e2eStartingBoardToTestWinning);
      cy.getTile('0', '2').click();
      cy.getTile('3', '3').rightclick();
      cy.getTile('3', '0').click();
      cy.get('.subtext').should('have.text', 'You Win');
      cy.getTile('0', '0').click();
    });
  });

  describe('when a user wins the game', () => {
    it('no further interactions with the board can be performed', () => {
      cy.getTile('0', '0').click();
      cy.getTile('0', '0').should('have.attr', 'data-status', 'hidden');
      cy.getTile('0', '0').should('have.text', '');
    });
  });
});

describe('losing a game', () => {
  describe('when the user clicks on a min', () => {
    it('the user loses the game', () => {
      cy.visitApp(e2eStartingBoard);
      cy.getTile('0', '0').click();
      cy.get('.subtext').should('have.text', 'You Lose');
    });
  });

  describe('when a user loses the game', () => {
    it('no further interactions with the board can be performed', () => {
      cy.getTile('0', '1').click();
      cy.getTile('0', '1').should('have.attr', 'data-status', 'hidden');
      cy.getTile('0', '1').should('have.text', '');
    });
  });
});
