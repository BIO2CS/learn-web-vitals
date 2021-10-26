import { useEffect, useRef, useState } from "react";
import "../styles/carousel.css";

enum Direction {
	BACK,
	FORWARD,
}

const GAP = 10;

export default function AutoCarousel() {
	const slideContainerRef = useRef<HTMLDivElement | null>(null);
	const backRef = useRef<HTMLDivElement | null>(null);
	const forwardRef = useRef<HTMLDivElement | null>(null);
	const slidesRef = useRef<Array<HTMLDivElement | null>>([]);
	const slideIndicatorRefs = useRef<Array<HTMLDivElement | null>>([]);

	const timerId = useRef<number | null>(null);

	const [currentIndex, setCurrentIndex] = useState<number>(0);

	useEffect(() => {
		timerId.current = window.setInterval(
			() => navigate(Direction.FORWARD),
			3000
		);
		return () => {
			if (timerId.current) {
				clearInterval(timerId.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onKeyDownHandler = (event: KeyboardEvent) => {
		if (timerId.current) {
			clearInterval(timerId.current);
		}
		if (event.code === "ArrowLeft") {
			navigate(Direction.BACK);
		}
		if (event.code === "ArrowRight") {
			navigate(Direction.FORWARD);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", onKeyDownHandler);
		return () => document.removeEventListener("keydown", onKeyDownHandler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const slidesChildren =
			Array.from(slideContainerRef.current?.children ?? []).filter(
				(c) => c.tagName === "DIV"
			) ?? [];
		slidesChildren.forEach(
			(e, index) => (slidesRef.current[index] = e as HTMLDivElement)
		);
	}, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const target = entry.target as HTMLDivElement;
						const index = parseInt(target.dataset.slideIndex ?? "0", 10);
						setCurrentIndex(index);
					}
				});
			},
			{
				root: slideContainerRef.current,
				threshold: 0.5,
			}
		);
		slidesRef.current.forEach((slide) => {
			if (slide) {
				observer.observe(slide);
			}
		});
	}, []);

	const getScrollPosition = (direction: Direction): number => {
		const slideElement = slidesRef.current[0];
		const maxScrollLeft =
			(slideContainerRef.current?.scrollWidth ?? 0) -
			(slideElement?.offsetWidth ?? 0);
		if (direction === Direction.BACK) {
			const updatedScrollLeft =
				(slideContainerRef.current?.scrollLeft ?? 0) -
				(slideElement?.offsetWidth ?? 0) -
				GAP;
			return updatedScrollLeft >= 0 ? updatedScrollLeft : maxScrollLeft;
		} else {
			const updatedScrollLeft =
				(slideContainerRef.current?.scrollLeft ?? 0) +
				(slideElement?.offsetWidth ?? 0) +
				GAP;
			if (updatedScrollLeft > maxScrollLeft) {
				return 0;
			}
			return updatedScrollLeft;
		}
	};

	const navigate = (direction: Direction) => {
		if (slideContainerRef.current) {
			slideContainerRef.current.scrollLeft = getScrollPosition(direction);
		}
	};

	const onBackButtonClick = () => {
		navigate(Direction.BACK);
	};

	const onForwardButtonClick = () => {
		navigate(Direction.FORWARD);
	};

	const onMouseEnter = () => {
		if (timerId.current) {
			clearInterval(timerId.current);
		}
	};

	return (
		<div>
			<h1>Autoplay carousel</h1>
			<div id="carousel">
				<div
					id="slide-container"
					ref={slideContainerRef}
					onMouseEnter={onMouseEnter}
				>
					<div className="slide" data-slide-index="0">
						<div className="slide-banner">
							Tour the Empire State Building!
							<a href="#">Buy tickets now.</a>
						</div>
						<img
							src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/d5JiF2JjxniJRH6xviYA.jpg"
							alt="Tour the Empire State Building!"
							width="1200"
							height="600"
						/>
					</div>
					<div className="slide" data-slide-index="1">
						<div className="slide-banner">
							Ride the Shinkansen!
							<a href="#">Buy tickets now.</a>
						</div>
						<img
							src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/atRogpxlJTXAvhWe654i.jpg"
							alt="Ride the Shinkansen!"
							width="1200"
							height="600"
						/>
					</div>
					<div className="slide" data-slide-index="2">
						<div className="slide-banner">
							Discover relaxation!
							<a href="#">Buy tickets now.</a>
						</div>
						<img
							src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/q8svpF1B6dG5wNuiTgyV.jpg"
							alt="Discover relaxation!"
							width="1200"
							height="600"
						/>
					</div>
					<div className="slide" data-slide-index="3">
						<div className="slide-banner">
							See penguins!
							<a href="#">Buy tickets now.</a>
						</div>
						<img
							src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/oweFaoCZ4g8bieZdvG5L.jpg"
							alt="See penguins!"
							width="1200"
							height="600"
						/>
					</div>
					<div className="slide" data-slide-index="4">
						<div className="slide-banner">
							Take a ride on the wheel!
							<a href="#">Buy tickets now.</a>
						</div>
						<img
							src="https://web-dev.imgix.net/image/j2RDdG43oidUy6AL6LovThjeX9c2/G0aWgHwWJTPZus9YEMyH.jpg"
							alt="Take a ride on the wheel!"
							width="1200"
							height="600"
						/>
					</div>
				</div>
				<div
					className="arrow back"
					id="back-button"
					ref={backRef}
					onClick={onBackButtonClick}
				>
					&larr;
				</div>
				<div
					className="arrow forward"
					id="back-forward"
					ref={forwardRef}
					onClick={onForwardButtonClick}
				>
					&rarr;
				</div>
				<div className="slide-indicators" onMouseEnter={onMouseEnter}>
					{Array.from({ length: 5 }).map((_, index) => (
						<div
							className={`slide-indicator ${
								currentIndex === index ? "active" : ""
							}`}
							ref={(elem) => (slideIndicatorRefs.current[index] = elem)}
						></div>
					))}
				</div>
			</div>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Maecenas volutpat
				blandit aliquam etiam erat velit. Integer eget aliquet nibh praesent.
				Sit amet mattis vulputate enim nulla. Faucibus nisl tincidunt eget
				nullam non. Sem fringilla ut morbi tincidunt augue. Sed id semper risus
				in hendrerit gravida rutrum quisque non. Blandit aliquam etiam erat
				velit scelerisque in dictum non consectetur. Et ultrices neque ornare
				aenean euismod. Dignissim sodales ut eu sem integer vitae justo. Justo
				eget magna fermentum iaculis eu non diam phasellus.
			</p>
		</div>
	);
}
