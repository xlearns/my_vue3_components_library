<template>
	<div class="loading">
		<div class="loading-container">
			<template v-if="type == 1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="30px"
					height="30px"
					viewBox="0 0 50 50"
					style="enable-background:new 0 0 50 50;position:absolute;left:50%;top:50%"
					xml:space="preserve"
				>
					<path
						fill="#FF6700"
						d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
						transform="rotate(275.098 25 25)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="rotate"
							from="0 25 25"
							to="360 25 25"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</path>
				</svg>
			</template>
			<template v-else-if="type == 2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="30px"
					height="30px"
					viewBox="0 0 24 24"
					style="enable-background:new 0 0 50 50;position:absolute;left:50%;top:50%"
					xml:space="preserve"
				>
					<rect
						x="0"
						y="0"
						width="4"
						height="7"
						fill="#FF6700"
						transform="scale(1 1.94336)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="scale"
							values="1,1; 1,3; 1,1"
							begin="0s"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</rect>
					<rect
						x="10"
						y="0"
						width="4"
						height="7"
						fill="#FF6700"
						transform="scale(1 2.72331)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="scale"
							values="1,1; 1,3; 1,1"
							begin="0.2s"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</rect>
					<rect
						x="20"
						y="0"
						width="4"
						height="7"
						fill="#FF6700"
						transform="scale(1 1.38997)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="scale"
							values="1,1; 1,3; 1,1"
							begin="0.4s"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</rect>
				</svg>
			</template>
			<template v-else-if="type == 3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="24px"
					height="30px"
					viewBox="0 0 24 30"
					style="enable-background:new 0 0 50 50;position:absolute;left:50%;top:50%"
					xml:space="preserve"
				>
					<rect
						x="0"
						y="0"
						width="4"
						height="10"
						fill="#FF6700"
						transform="translate(0 9.4336)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="translate"
							values="0 0; 0 20; 0 0"
							begin="0"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</rect>
					<rect
						x="10"
						y="0"
						width="4"
						height="10"
						fill="#FF6700"
						transform="translate(0 17.2331)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="translate"
							values="0 0; 0 20; 0 0"
							begin="0.2s"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</rect>
					<rect
						x="20"
						y="0"
						width="4"
						height="10"
						fill="#FF6700"
						transform="translate(0 3.89973)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="translate"
							values="0 0; 0 20; 0 0"
							begin="0.4s"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</rect>
				</svg>
			</template>
			<template v-else-if="type == 4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="24px"
					height="30px"
					viewBox="0 0 24 30"
					style="enable-background:new 0 0 50 50;position:absolute;left:50%;top:50%"
					xml:space="preserve"
				>
					<rect x="0" y="9.22656" width="4" height="12.5469" fill="#FF6700">
						<animate
							attributeName="height"
							attributeType="XML"
							values="5;21;5"
							begin="0s"
							dur="0.6s"
							repeatCount="indefinite"
						></animate>
						<animate
							attributeName="y"
							attributeType="XML"
							values="13; 5; 13"
							begin="0s"
							dur="0.6s"
							repeatCount="indefinite"
						></animate>
					</rect>
					<rect x="10" y="5.22656" width="4" height="20.5469" fill="#FF6700">
						<animate
							attributeName="height"
							attributeType="XML"
							values="5;21;5"
							begin="0.15s"
							dur="0.6s"
							repeatCount="indefinite"
						></animate>
						<animate
							attributeName="y"
							attributeType="XML"
							values="13; 5; 13"
							begin="0.15s"
							dur="0.6s"
							repeatCount="indefinite"
						></animate>
					</rect>
					<rect x="20" y="8.77344" width="4" height="13.4531" fill="#FF6700">
						<animate
							attributeName="height"
							attributeType="XML"
							values="5;21;5"
							begin="0.3s"
							dur="0.6s"
							repeatCount="indefinite"
						></animate>
						<animate
							attributeName="y"
							attributeType="XML"
							values="13; 5; 13"
							begin="0.3s"
							dur="0.6s"
							repeatCount="indefinite"
						></animate>
					</rect>
				</svg>
			</template>
			<template v-else>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="30px"
					height="30px"
					viewBox="0 0 50 50"
					style="enable-background:new 0 0 50 50;position:absolute;left:50%;top:50%"
					xml:space="preserve"
				>
					<path
						fill="#FF6700"
						d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
						transform="rotate(275.098 25 25)"
					>
						<animateTransform
							attributeType="xml"
							attributeName="transform"
							type="rotate"
							from="0 25 25"
							to="360 25 25"
							dur="0.6s"
							repeatCount="indefinite"
						></animateTransform>
					</path>
				</svg>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	props: {
		type: String,
	},
	name: "Loading",
});
</script>
