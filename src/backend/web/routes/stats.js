require('../../lib/config');
const express = require('express');
const Stats = require('../../data/stats');
const { logger } = require('../../utils/logger');

const stats = express.Router();

const statsRoute = statsPeriod => async (req, res) => {
  try {
    const data = await statsPeriod.calculate();
    res.json(data);
  } catch (err) {
    logger.error({ err }, 'Unable to get stats from database');
    res.status(503).json({
      message: 'Unable to get stats from database',
    });
  }
};

/**
 * Get stats for today
 */
stats.get('/today', statsRoute(Stats.today()));

/**
 * Get stats for this week so far
 */
stats.get('/week', statsRoute(Stats.thisWeek()));

/**
 * Get stats for this month so far
 */
stats.get('/month', statsRoute(Stats.thisMonth()));

/**
 * Get stats for this year so far
 */
stats.get('/year', statsRoute(Stats.thisYear()));

module.exports = stats;
