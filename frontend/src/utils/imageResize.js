import pica from 'pica';

let _pica;

const _blob_to_image = function (env) {
  const URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  env.image = document.createElement('img');
  env.image_url = URL.createObjectURL(env.blob);
  env.image.src = env.image_url;

  return new Promise(function (resolve, reject) {
    env.image.onerror = function () {
      reject(new Error('ImageBlobReduce: failed to create Image() from blob'));
    };
    env.image.onload = function () {
      resolve(env);
    };
  });
}

const _calculate_size = function (env) {
  //
  // Note, if your need not "symmetric" resize logic, you MUST check
  // `env.orientation` (set by plugins) and swap width/height appropriately.
  //
  let scale_factor = env.opts.max / Math.max(env.image.width, env.image.height);

  if (scale_factor > 1) scale_factor = 1;

  env.transform_width = Math.max(Math.round(env.image.width * scale_factor), 1);
  env.transform_height = Math.max(Math.round(env.image.height * scale_factor), 1);

  // Info for user plugins, to check if scaling applied
  env.scale_factor = scale_factor;

  return Promise.resolve(env);
};

const _transform = function (env) {
  env.out_canvas = _pica.options.createCanvas(env.transform_width, env.transform_height);

  // Dim env temporary vars to prohibit use and avoid confusion when orientation
  // changed. You should take real size from canvas.
  env.transform_width = null;
  env.transform_height = null;

  // By default use alpha for png only
  const pica_opts = {
    alpha: env.blob.type === 'image/png',
    ...(env.opts.pica || {})
  };

  return _pica
    .resize(env.image, env.out_canvas, pica_opts)
    .then(function () {
      return env;
    });
};

const _cleanup = function (env) {
  env.image.src = '';
  env.image = null;

  const URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
  if (URL.revokeObjectURL) URL.revokeObjectURL(env.image_url);

  env.image_url = null;

  return Promise.resolve(env);
};


const _create_blob = function (env) {
  return _pica.toBlob(env.out_canvas, env.blob.type)
    .then(function (blob) {
      env.out_blob = blob;
      return env;
    });
};

export default async function imageResize(blob, options) {

  if (!_pica) {
    _pica = pica();
  }

  try {
    return await Promise.resolve({
      blob: blob,
      opts: {
        max: Infinity,
        ...options
      }
    })
      .then(_blob_to_image)
      .then(_calculate_size)
      .then(_transform)
      .then(_cleanup)
      .then(_create_blob)
      .then(function (_env) {
        // Safari 12 workaround
        // https://github.com/nodeca/pica/issues/199
        _env.out_canvas.width = _env.out_canvas.height = 0;

        return _env.out_blob;
      });
  } catch (e) {
    console.log(e);
    return blob;
  }

};


