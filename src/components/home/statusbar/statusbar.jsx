import { useEffect, useState } from "react";
import { useLanguage } from "../../../contexts/language-context.jsx";
import {
  GroupIcon,
  SofaIcon,
  DeliveryTruckIcon,
  StarIcon,
} from "./statusbaricon.jsx";

const stats = [
  {
    Icon: GroupIcon,
    target: 10000,
    finalValue: "10K+",
    format: (value) => {
      if (value < 1000) return Math.floor(value).toLocaleString();
      if (value >= 10000) return "10K+";
      return `${(value / 1000).toFixed(1)}K+`;
    },
    labelKey: "happyCustomers",
  },
  {
    Icon: SofaIcon,
    target: 500,
    finalValue: "500+",
    format: (value) => `${Math.floor(value)}+`,
    labelKey: "premiumProducts",
  },
  {
    Icon: DeliveryTruckIcon,
    target: 50,
    finalValue: "50+",
    format: (value) => `${Math.floor(value)}+`,
    labelKey: "citiesDelivery",
  },
  {
    Icon: StarIcon,
    target: 4.8,
    finalValue: "4.8/5",
    format: (value) => `${value.toFixed(1)}/5`,
    labelKey: "customerRating",
  },
];

function AnimatedValue({ stat, start }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(stat.target);
      return;
    }

    let frameId;
    const startTime = performance.now();
    const duration = 1900;

    const updateValue = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setValue(stat.target * easedProgress);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateValue);
      }
    };

    frameId = requestAnimationFrame(updateValue);

    return () => cancelAnimationFrame(frameId);
  }, [start, stat]);

  return <strong aria-label={stat.finalValue}>{stat.format(value)}</strong>;
}

function StatusBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => window.clearTimeout(timerId);
  }, []);

  return (
    <section
      className={`status-bar ${isVisible ? "is-visible" : ""}`}
      aria-label={t("statusHighlights")}
    >
      {stats.map((stat) => (
        <div className="status-item" key={stat.labelKey}>
          <span className="status-icon-wrap">
            <stat.Icon />
          </span>

          <span className="status-copy">
            <AnimatedValue stat={stat} start={isVisible} />
            <span>{t(stat.labelKey)}</span>
          </span>
        </div>
      ))}
    </section>
  );
}

export default StatusBar;
