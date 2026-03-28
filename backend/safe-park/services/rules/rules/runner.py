import logging
import time

from rules.engine import RuleEngine


logger = logging.getLogger("safepark.rules")


def run_demo_loop() -> None:
    engine = RuleEngine()
    logger.info("Safe Park rules demo loop started")
    while True:
        decision = engine.vehicle_count_changed(120, 121)
        logger.info("Rule evaluation sample: %s", decision)
        time.sleep(10)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
    run_demo_loop()

