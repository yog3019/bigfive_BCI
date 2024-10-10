import { directConvolution } from 'ml-convolution';

const conv = (input, kernel) => directConvolution(input, kernel);

/**
 * @name validate
 * @param data with length 104
 * @return true / false
 */
const validate = (data, offset = 0) => {
  let sum = 0;
  for(let i = 7; i <= 102; ++i) {
    sum += data[i+offset];
  }
  return ((data[0+offset] === 170 && data[1+offset] === 170 && data[2+offset] === 131) && ((4294967295 - sum) & 255) === data[103+offset]);
}

/**
 * @name filter
 * @param data
 */
const filter = (data) => {
  // magic number
  const voltCoef = 0.0961621602376302; // =(2.42*1000000/6)/4194304, VRef=2.42*10^6/6; Coe=VRef/2^22;
  const hp_05_2 = [0.000052, 0.000055, 0.000058, 0.000060, 0.000063, 0.000066, 0.000070, 0.000073, 0.000076, 0.000079, 0.000083, 0.000086, 0.000089, 0.000093, 0.000096,
    0.000100, 0.000104, 0.000107, 0.000111, 0.000115, 0.000119, 0.000123, 0.000127, 0.000131, 0.000135, 0.000139, 0.000143, 0.000147, 0.000152, 0.000156,
    0.000160, 0.000165, 0.000169, 0.000174, 0.000178, 0.000183, 0.000187, 0.000192, 0.000197, 0.000201, 0.000206, 0.000211, 0.000215, 0.000220, 0.000225,
    0.000230, 0.000235, 0.000239, 0.000244, 0.000249, 0.000254, 0.000259, 0.000264, 0.000269, 0.000273, 0.000278, 0.000283, 0.000288, 0.000293, 0.000298,
    0.000302, 0.000307, 0.000312, 0.000317, 0.000321, 0.000326, 0.000331, 0.000335, 0.000340, 0.000345, 0.000349, 0.000354, 0.000358, 0.000362, 0.000367,
    0.000371, 0.000375, 0.000379, 0.000383, 0.000387, 0.000391, 0.000395, 0.000399, 0.000402, 0.000406, 0.000410, 0.000413, 0.000416, 0.000420, 0.000423,
    0.000426, 0.000429, 0.000431, 0.000434, 0.000437, 0.000439, 0.000441, 0.000444, 0.000446, 0.000448, 0.000449, 0.000451, 0.000453, 0.000454, 0.000455,
    0.000456, 0.000457, 0.000458, 0.000458, 0.000459, 0.000459, 0.000459, 0.000459, 0.000459, 0.000458, 0.000458, 0.000457, 0.000456, 0.000454, 0.000453,
    0.000451, 0.000449, 0.000447, 0.000445, 0.000442, 0.000440, 0.000437, 0.000434, 0.000430, 0.000427, 0.000423, 0.000419, 0.000414, 0.000410, 0.000405,
    0.000400, 0.000394, 0.000389, 0.000383, 0.000377, 0.000370, 0.000364, 0.000357, 0.000350, 0.000342, 0.000335, 0.000327, 0.000318, 0.000310, 0.000301,
    0.000292, 0.000282, 0.000273, 0.000263, 0.000252, 0.000242, 0.000231, 0.000220, 0.000208, 0.000197, 0.000185, 0.000172, 0.000160, 0.000147, 0.000133,
    0.000120, 0.000106, 0.000092, 0.000077, 0.000062, 0.000047, 0.000032, 0.000016, 0.000000  -0.000016  -0.000033  -0.000050  -0.000067  -0.000085  -0.000103,
    -0.000121, -0.000140, -0.000159, -0.000178, -0.000197, -0.000217, -0.000237, -0.000257, -0.000278, -0.000299, -0.000321, -0.000342, -0.000364, -0.000386, -0.000409,
    -0.000432, -0.000455, -0.000478, -0.000502, -0.000526, -0.000550, -0.000575, -0.000600, -0.000625, -0.000650, -0.000676, -0.000702, -0.000729, -0.000755, -0.000782,
    -0.000809, -0.000836, -0.000864, -0.000892, -0.000920, -0.000948, -0.000977, -0.001006, -0.001035, -0.001064, -0.001094, -0.001124, -0.001154, -0.001184, -0.001214,
    -0.001245, -0.001276, -0.001307, -0.001338, -0.001370, -0.001401, -0.001433, -0.001465, -0.001498, -0.001530, -0.001563, -0.001595, -0.001628, -0.001661, -0.001694,
    -0.001728, -0.001761, -0.001795, -0.001829, -0.001862, -0.001896, -0.001931, -0.001965, -0.001999, -0.002033, -0.002068, -0.002102, -0.002137, -0.002172, -0.002206,
    -0.002241, -0.002276, -0.002311, -0.002346, -0.002381, -0.002416, -0.002451, -0.002486, -0.002521, -0.002556, -0.002591, -0.002626, -0.002661, -0.002696, -0.002731,
    -0.002766, -0.002801, -0.002836, -0.002870, -0.002905, -0.002940, -0.002974, -0.003009, -0.003043, -0.003077, -0.003112, -0.003146, -0.003180, -0.003213, -0.003247,
    -0.003281, -0.003314, -0.003347, -0.003380, -0.003413, -0.003446, -0.003478, -0.003511, -0.003543, -0.003575, -0.003607, -0.003638, -0.003670, -0.003701, -0.003732,
    -0.003762, -0.003793, -0.003823, -0.003853, -0.003883, -0.003912, -0.003941, -0.003970, -0.003998, -0.004027, -0.004055, -0.004082, -0.004110, -0.004137, -0.004163,
    -0.004190, -0.004216, -0.004241, -0.004267, -0.004292, -0.004316, -0.004340, -0.004364, -0.004388, -0.004411, -0.004434, -0.004456, -0.004478, -0.004500, -0.004521,
    -0.004542, -0.004562, -0.004582, -0.004602, -0.004621, -0.004639, -0.004658, -0.004675, -0.004693, -0.004710, -0.004726, -0.004742, -0.004758, -0.004773, -0.004788,
    -0.004802, -0.004815, -0.004829, -0.004842, -0.004854, -0.004866, -0.004877, -0.004888, -0.004898, -0.004908, -0.004917, -0.004926, -0.004935, -0.004943, -0.004950,
    -0.004957, -0.004963, -0.004969, -0.004974, -0.004979, -0.004984, -0.004987, -0.004991, -0.004994, -0.004996, -0.004998, -0.004999, -0.005000, 0.995000, -0.005000,
    -0.004999, -0.004998, -0.004996, -0.004994, -0.004991, -0.004987, -0.004984, -0.004979, -0.004974, -0.004969, -0.004963, -0.004957, -0.004950, -0.004943, -0.004935,
    -0.004926, -0.004917, -0.004908, -0.004898, -0.004888, -0.004877, -0.004866, -0.004854, -0.004842, -0.004829, -0.004815, -0.004802, -0.004788, -0.004773, -0.004758,
    -0.004742, -0.004726, -0.004710, -0.004693, -0.004675, -0.004658, -0.004639, -0.004621, -0.004602, -0.004582, -0.004562, -0.004542, -0.004521, -0.004500, -0.004478,
    -0.004456, -0.004434, -0.004411, -0.004388, -0.004364, -0.004340, -0.004316, -0.004292, -0.004267, -0.004241, -0.004216, -0.004190, -0.004163, -0.004137, -0.004110,
    -0.004082, -0.004055, -0.004027, -0.003998, -0.003970, -0.003941, -0.003912, -0.003883, -0.003853, -0.003823, -0.003793, -0.003762, -0.003732, -0.003701, -0.003670,
    -0.003638, -0.003607, -0.003575, -0.003543, -0.003511, -0.003478, -0.003446, -0.003413, -0.003380, -0.003347, -0.003314, -0.003281, -0.003247, -0.003213, -0.003180,
    -0.003146, -0.003112, -0.003077, -0.003043, -0.003009, -0.002974, -0.002940, -0.002905, -0.002870, -0.002836, -0.002801, -0.002766, -0.002731, -0.002696, -0.002661,
    -0.002626, -0.002591, -0.002556, -0.002521, -0.002486, -0.002451, -0.002416, -0.002381, -0.002346, -0.002311, -0.002276, -0.002241, -0.002206, -0.002172, -0.002137,
    -0.002102, -0.002068, -0.002033, -0.001999, -0.001965, -0.001931, -0.001896, -0.001862, -0.001829, -0.001795, -0.001761, -0.001728, -0.001694, -0.001661, -0.001628,
    -0.001595, -0.001563, -0.001530, -0.001498, -0.001465, -0.001433, -0.001401, -0.001370, -0.001338, -0.001307, -0.001276, -0.001245, -0.001214, -0.001184, -0.001154,
    -0.001124, -0.001094, -0.001064, -0.001035, -0.001006, -0.000977, -0.000948, -0.000920, -0.000892, -0.000864, -0.000836, -0.000809, -0.000782, -0.000755, -0.000729,
    -0.000702, -0.000676, -0.000650, -0.000625, -0.000600, -0.000575, -0.000550, -0.000526, -0.000502, -0.000478, -0.000455, -0.000432, -0.000409, -0.000386, -0.000364,
    -0.000342, -0.000321, -0.000299, -0.000278, -0.000257, -0.000237, -0.000217, -0.000197, -0.000178, -0.000159, -0.000140, -0.000121, -0.000103, -0.000085, -0.000067,
    -0.000050, -0.000033, -0.000016, 0.000000, 0.000016, 0.000032, 0.000047, 0.000062, 0.000077, 0.000092, 0.000106, 0.000120, 0.000133, 0.000147, 0.000160,
    0.000172, 0.000185, 0.000197, 0.000208, 0.000220, 0.000231, 0.000242, 0.000252, 0.000263, 0.000273, 0.000282, 0.000292, 0.000301, 0.000310, 0.000318,
    0.000327, 0.000335, 0.000342, 0.000350, 0.000357, 0.000364, 0.000370, 0.000377, 0.000383, 0.000389, 0.000394, 0.000400, 0.000405, 0.000410, 0.000414,
    0.000419, 0.000423, 0.000427, 0.000430, 0.000434, 0.000437, 0.000440, 0.000442, 0.000445, 0.000447, 0.000449, 0.000451, 0.000453, 0.000454, 0.000456,
    0.000457, 0.000458, 0.000458, 0.000459, 0.000459, 0.000459, 0.000459, 0.000459, 0.000458, 0.000458, 0.000457, 0.000456, 0.000455, 0.000454, 0.000453,
    0.000451, 0.000449, 0.000448, 0.000446, 0.000444, 0.000441, 0.000439, 0.000437, 0.000434, 0.000431, 0.000429, 0.000426, 0.000423, 0.000420, 0.000416,
    0.000413, 0.000410, 0.000406, 0.000402, 0.000399, 0.000395, 0.000391, 0.000387, 0.000383, 0.000379, 0.000375, 0.000371, 0.000367, 0.000362, 0.000358,
    0.000354, 0.000349, 0.000345, 0.000340, 0.000335, 0.000331, 0.000326, 0.000321, 0.000317, 0.000312, 0.000307, 0.000302, 0.000298, 0.000293, 0.000288,
    0.000283, 0.000278, 0.000273, 0.000269, 0.000264, 0.000259, 0.000254, 0.000249, 0.000244, 0.000239, 0.000235, 0.000230, 0.000225, 0.000220, 0.000215,
    0.000211, 0.000206, 0.000201, 0.000197, 0.000192, 0.000187, 0.000183, 0.000178, 0.000174, 0.000169, 0.000165, 0.000160, 0.000156, 0.000152, 0.000147,
    0.000143, 0.000139, 0.000135, 0.000131, 0.000127, 0.000123, 0.000119, 0.000115, 0.000111, 0.000107, 0.000104, 0.000100, 0.000096, 0.000093, 0.000089,
    0.000086, 0.000083, 0.000079, 0.000076, 0.000073, 0.000070, 0.000066, 0.000063, 0.000060, 0.000058, 0.000055, 0.000052];
  const Bandstop_500_50 = [0.000124, 0.000099, 0.000038, -0.000037, -0.000096, -0.000117, -0.000093, -0.000035, 0.000034, 0.000087, 0.000105, 0.000083, 0.000031, -0.000030, -0.000074,
    -0.000088, -0.000068, -0.000025, 0.000023, 0.000057, 0.000065, 0.000049, 0.000017, -0.000015, -0.000034, -0.000036, -0.000024, -0.000007, 0.000005, 0.000006,
    -0.000000, -0.000007, -0.000005, 0.000008, 0.000028, 0.000043, 0.000043, 0.000019, -0.000023, -0.000068, -0.000095, -0.000086, -0.000036, 0.000040, 0.000114,
    0.000154, 0.000135, 0.000056, -0.000060, -0.000168, -0.000222, -0.000192, -0.000078, 0.000083, 0.000229, 0.000299, 0.000255, 0.000103, -0.000108, -0.000297,
    -0.000386, -0.000327, -0.000131, 0.000137, 0.000374, 0.000482, 0.000406, 0.000162, -0.000168, -0.000458, -0.000587, -0.000493, -0.000195, 0.000203, 0.000550,
    0.000703, 0.000589, 0.000233, -0.000240, -0.000650, -0.000829, -0.000692, -0.000273, 0.000281, 0.000758, 0.000965, 0.000804, 0.000316, -0.000325, -0.000875,
    -0.001111, -0.000924, -0.000362, 0.000372, 0.001000, 0.001268, 0.001052, 0.000412, -0.000422, -0.001132, -0.001434, -0.001188, -0.000464, 0.000475, 0.001273,
    0.001609, 0.001331, 0.000520, -0.000531, -0.001421, -0.001794, -0.001482, -0.000578, 0.000590, 0.001577, 0.001988, 0.001641, 0.000639, -0.000652, -0.001739,
    -0.002191, -0.001806, -0.000703, 0.000716, 0.001908, 0.002401, 0.001977, 0.000769, -0.000782, -0.002083, -0.002619, -0.002155, -0.000837, 0.000851, 0.002264,
    0.002844, 0.002338, 0.000907, -0.000921, -0.002449, -0.003074, -0.002525, -0.000979, 0.000994, 0.002639, 0.003310, 0.002717, 0.001052, -0.001067, -0.002833,
    -0.003550, -0.002911, -0.001127, 0.001142, 0.003030, 0.003794, 0.003109, 0.001203, -0.001218, -0.003228, -0.004040, -0.003308, -0.001279, 0.001294, 0.003429,
    0.004288, 0.003509, 0.001356, -0.001371, -0.003629, -0.004536, -0.003710, -0.001432, 0.001448, 0.003830, 0.004783, 0.003910, 0.001509, -0.001524, -0.004029,
    -0.005029, -0.004108, -0.001584, 0.001599, 0.004226, 0.005272, 0.004304, 0.001659, -0.001674, -0.004420, -0.005511, -0.004497, -0.001732, 0.001747, 0.004610,
    0.005745, 0.004685, 0.001804, -0.001818, -0.004796, -0.005973, -0.004869, -0.001873, 0.001887, 0.004976, 0.006194, 0.005046, 0.001941, -0.001954, -0.005149,
    -0.006406, -0.005216, -0.002005, 0.002018, 0.005315, 0.006609, 0.005379, 0.002066, -0.002078, -0.005472, -0.006801, -0.005532, -0.002125, 0.002136, 0.005620,
    0.006982, 0.005677, 0.002179, -0.002189, -0.005759, -0.007151, -0.005811, -0.002229, 0.002239, 0.005887, 0.007306, 0.005935, 0.002276, -0.002285, -0.006003,
    -0.007448, -0.006047, -0.002318, 0.002326, 0.006108, 0.007574, 0.006147, 0.002355, -0.002362, -0.006201, -0.007685, -0.006234, -0.002387, 0.002393, 0.006280,
    0.007780, 0.006308, 0.002415, -0.002419, -0.006346, -0.007859, -0.006369, -0.002437, 0.002441, 0.006399, 0.007920, 0.006416, 0.002454, -0.002456, -0.006437,
    -0.007965, -0.006449, -0.002465, 0.002467, 0.006462, 0.007991, 0.006468, 0.002471, -0.002472, -0.006472, 0.992000, -0.006472, -0.002472, 0.002471, 0.006468,
    0.007991, 0.006462, 0.002467, -0.002465, -0.006449, -0.007965, -0.006437, -0.002456, 0.002454, 0.006416, 0.007920, 0.006399, 0.002441, -0.002437, -0.006369,
    -0.007859, -0.006346, -0.002419, 0.002415, 0.006308, 0.007780, 0.006280, 0.002393, -0.002387, -0.006234, -0.007685, -0.006201, -0.002362, 0.002355, 0.006147,
    0.007574, 0.006108, 0.002326, -0.002318, -0.006047, -0.007448, -0.006003, -0.002285, 0.002276, 0.005935, 0.007306, 0.005887, 0.002239, -0.002229, -0.005811,
    -0.007151, -0.005759, -0.002189, 0.002179, 0.005677, 0.006982, 0.005620, 0.002136, -0.002125, -0.005532, -0.006801, -0.005472, -0.002078, 0.002066, 0.005379,
    0.006609, 0.005315, 0.002018, -0.002005, -0.005216, -0.006406, -0.005149, -0.001954, 0.001941, 0.005046, 0.006194, 0.004976, 0.001887, -0.001873, -0.004869,
    -0.005973, -0.004796, -0.001818, 0.001804, 0.004685, 0.005745, 0.004610, 0.001747, -0.001732, -0.004497, -0.005511, -0.004420, -0.001674, 0.001659, 0.004304,
    0.005272, 0.004226, 0.001599, -0.001584, -0.004108, -0.005029, -0.004029, -0.001524, 0.001509, 0.003910, 0.004783, 0.003830, 0.001448, -0.001432, -0.003710,
    -0.004536, -0.003629, -0.001371, 0.001356, 0.003509, 0.004288, 0.003429, 0.001294, -0.001279, -0.003308, -0.004040, -0.003228, -0.001218, 0.001203, 0.003109,
    0.003794, 0.003030, 0.001142, -0.001127, -0.002911, -0.003550, -0.002833, -0.001067, 0.001052, 0.002717, 0.003310, 0.002639, 0.000994, -0.000979, -0.002525,
    -0.003074, -0.002449, -0.000921, 0.000907, 0.002338, 0.002844, 0.002264, 0.000851, -0.000837, -0.002155, -0.002619, -0.002083, -0.000782, 0.000769, 0.001977,
    0.002401, 0.001908, 0.000716, -0.000703, -0.001806, -0.002191, -0.001739, -0.000652, 0.000639, 0.001641, 0.001988, 0.001577, 0.000590, -0.000578, -0.001482,
    -0.001794, -0.001421, -0.000531, 0.000520, 0.001331, 0.001609, 0.001273, 0.000475, -0.000464, -0.001188, -0.001434, -0.001132, -0.000422, 0.000412, 0.001052,
    0.001268, 0.001000, 0.000372, -0.000362, -0.000924, -0.001111, -0.000875, -0.000325, 0.000316, 0.000804, 0.000965, 0.000758, 0.000281, -0.000273, -0.000692,
    -0.000829, -0.000650, -0.000240, 0.000233, 0.000589, 0.000703, 0.000550, 0.000203, -0.000195, -0.000493, -0.000587, -0.000458, -0.000168, 0.000162, 0.000406,
    0.000482, 0.000374, 0.000137, -0.000131, -0.000327, -0.000386, -0.000297, -0.000108, 0.000103, 0.000255, 0.000299, 0.000229, 0.000083, -0.000078, -0.000192,
    -0.000222, -0.000168, -0.000060, 0.000056, 0.000135, 0.000154, 0.000114, 0.000040, -0.000036, -0.000086, -0.000095, -0.000068, -0.000023, 0.000019, 0.000043,
    0.000043, 0.000028, 0.000008, -0.000005, -0.000007, -0.000000, 0.000006, 0.000005, -0.000007, -0.000024, -0.000036, -0.000034, -0.000015, 0.000017, 0.000049,
    0.000065, 0.000057, 0.000023, -0.000025, -0.000068, -0.000088, -0.000074, -0.000030, 0.000031, 0.000083, 0.000105, 0.000087, 0.000034, -0.000035, -0.000093,
    -0.000117, -0.000096, -0.000037, 0.000038, 0.000099, 0.000124];
  
  const result = conv(conv(conv(data, hp_05_2), Bandstop_500_50), hp_05_2);
  
  const ans = result; //.slice(1526, result.length-1527); // 掐头去尾

  for(let i in ans) {
    ans[i] *= voltCoef;
  }

  return ans;
}
/**
 * @name getData
 * @param data with length 104
 * @return { ch1, ch2 }
 */
const getData = (data) => {

  if(!validate(data)) return;
  const ch1 = [];
  const ch2 = [];

  for(let i = 0; i < 16; ++i) {
    const offset = i * 6 + 7;
    let value1 = (data[offset] << 16) + (data[offset+1] << 8) + (data[offset+2]);
    let value2 = (data[offset+3] << 16) + (data[offset+4] << 8) + (data[offset+5]);
    if(value1 > 8388607) value1 -= 16777216;
    if(value2 > 8388607) value2 -= 16777216;

    ch1.push(value1);
    ch2.push(value2);
  }

  return { ch1, ch2 };
}
export { validate, getData };