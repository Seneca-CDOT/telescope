require('../../lib/config');
const express = require('express');
const Stats = require('../../data/stats');
const { logger } = require('../../utils/logger');

const stats = express.Router();

const statsRoute = (statsPeriod) => async (req, res, next) => {
  try {
    const data = await statsPeriod.calculate();
    res.json(data);
  } catch (error) {
    logger.error({ error }, 'Unable to get stats from database');
    next(error);
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
