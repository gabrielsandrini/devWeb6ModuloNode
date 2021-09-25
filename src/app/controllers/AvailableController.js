import AvailableService from '../services/AvailableService';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);
    const available = await AvailableService.run({
      date: searchDate,
      doctor_id: req.params.doctor_id,
    });

    return res.json(available);
  }
}

export default new AvailableController();
