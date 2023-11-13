const gitmojis = {
  ":art:": "\u{1F3A8}",
  ":zap:": "\u26A1\uFE0F",
  ":fire:": "\u{1F525}",
  ":bug:": "\u{1F41B}",
  ":ambulance:": "\u{1F691}\uFE0F",
  ":sparkles:": "\u2728",
  ":memo:": "\u{1F4DD}",
  ":rocket:": "\u{1F680}",
  ":lipstick:": "\u{1F484}",
  ":tada:": "\u{1F389}",
  ":white_check_mark:": "\u2705",
  ":lock:": "\u{1F512}\uFE0F",
  ":closed_lock_with_key:": "\u{1F510}",
  ":bookmark:": "\u{1F516}",
  ":rotating_light:": "\u{1F6A8}",
  ":construction:": "\u{1F6A7}",
  ":green_heart:": "\u{1F49A}",
  ":arrow_down:": "\u2B07\uFE0F",
  ":arrow_up:": "\u2B06\uFE0F",
  ":pushpin:": "\u{1F4CC}",
  ":construction_worker:": "\u{1F477}",
  ":chart_with_upwards_trend:": "\u{1F4C8}",
  ":recycle:": "\u267B\uFE0F",
  ":heavy_plus_sign:": "\u2795",
  ":heavy_minus_sign:": "\u2796",
  ":wrench:": "\u{1F527}",
  ":hammer:": "\u{1F528}",
  ":globe_with_meridians:": "\u{1F310}",
  ":pencil2:": "\u270F\uFE0F",
  ":pencil:": "\u270F\uFE0F",
  ":poop:": "\u{1F4A9}",
  ":rewind:": "\u23EA\uFE0F",
  ":twisted_rightwards_arrows:": "\u{1F500}",
  ":package:": "\u{1F4E6}\uFE0F",
  ":alien:": "\u{1F47D}\uFE0F",
  ":truck:": "\u{1F69A}",
  ":page_facing_up:": "\u{1F4C4}",
  ":boom:": "\u{1F4A5}",
  ":bento:": "\u{1F371}",
  ":wheelchair:": "\u267F\uFE0F",
  ":bulb:": "\u{1F4A1}",
  ":beers:": "\u{1F37B}",
  ":speech_balloon:": "\u{1F4AC}",
  ":card_file_box:": "\u{1F5C3}\uFE0F",
  ":loud_sound:": "\u{1F50A}",
  ":mute:": "\u{1F507}",
  ":busts_in_silhouette:": "\u{1F465}",
  ":children_crossing:": "\u{1F6B8}",
  ":building_construction:": "\u{1F3D7}\uFE0F",
  ":iphone:": "\u{1F4F1}",
  ":clown_face:": "\u{1F921}",
  ":egg:": "\u{1F95A}",
  ":see_no_evil:": "\u{1F648}",
  ":camera_flash:": "\u{1F4F8}",
  ":alembic:": "\u2697\uFE0F",
  ":mag:": "\u{1F50D}\uFE0F",
  ":label:": "\u{1F3F7}\uFE0F",
  ":seedling:": "\u{1F331}",
  ":triangular_flag_on_post:": "\u{1F6A9}",
  ":goal_net:": "\u{1F945}",
  ":dizzy:": "\u{1F4AB}",
  ":wastebasket:": "\u{1F5D1}\uFE0F",
  ":passport_control:": "\u{1F6C2}",
  ":adhesive_bandage:": "\u{1FA79}",
  ":monocle_face:": "\u{1F9D0}",
  ":coffin:": "\u26B0\uFE0F",
  ":test_tube:": "\u{1F9EA}",
  ":necktie:": "\u{1F454}",
  ":stethoscope:": "\u{1FA7A}",
  ":bricks:": "\u{1F9F1}",
  ":technologist:": "\u{1F9D1}\u200D\u{1F4BB}",
  ":money_with_wings:": "\u{1F4B8}",
  ":thread:": "\u{1F9F5}",
  ":safety_vest:": "\u{1F9BA}"
};
function convert(content, withSpace) {
  const re = new RegExp(Object.keys(gitmojis).join("|"), "gi");
  return content.replace(re, function(matched) {
    switch (withSpace) {
      case true:
      case "trailing":
        return `${gitmojis[matched.toLowerCase()]} `;
      case "leading":
        return ` ${gitmojis[matched.toLowerCase()]}`;
      case "both":
        return ` ${gitmojis[matched.toLowerCase()]} `;
      default:
        return gitmojis[matched.toLowerCase()];
    }
  });
}

export { convert };
