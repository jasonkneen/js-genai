/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ApiClient} from '../../src/_api_client';
import {
  tContent,
  tContents,
  tModel,
  tPart,
  tParts,
  tSchema,
  tSpeechConfig,
  tTool,
} from '../../src/_transformers';
import * as types from '../../src/types';

import {CrossUploader} from '../../src/cross/_cross_uploader';
import {FakeAuth} from '../_fake_auth';

describe('tModel', () => {
  it('empty string', () => {
    expect(() => {
      tModel(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        '',
      );
    }).toThrowError('model is required and must be a string');
  });
  it('returns model name for MLDev starting with models', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        'models/gemini-1.5-flash-exp',
      ),
    ).toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns model name for MLDev starting with tunedModels', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        'tunedModels/gemini-1.5-flash-exp',
      ),
    ).toEqual('tunedModels/gemini-1.5-flash-exp');
  });
  it('returns model prefix for MLDev', () => {
    expect(
      tModel(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        'gemini-1.5-flash-exp',
      ),
    ).toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with publishers', () => {
    expect(
      tModel(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        'publishers/gemini-1.5-flash-exp',
      ),
    ).toEqual('publishers/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with projects', () => {
    expect(
      tModel(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        'projects/gemini-1.5-flash-exp',
      ),
    ).toEqual('projects/gemini-1.5-flash-exp');
  });
  it('returns model name for Vertex starting with models', () => {
    expect(
      tModel(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        'models/gemini-1.5-flash-exp',
      ),
    ).toEqual('models/gemini-1.5-flash-exp');
  });
  it('returns publisher prefix for Vertex with slash', () => {
    expect(
      tModel(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        'google/gemini-1.5-flash-exp',
      ),
    ).toEqual('publishers/google/models/gemini-1.5-flash-exp');
  });
  it('returns publisher prefix for Vertex', () => {
    expect(
      tModel(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        'gemini-1.5-flash-exp',
      ),
    ).toEqual('publishers/google/models/gemini-1.5-flash-exp');
  });
});

describe('tSpeechConfig', () => {
  it('string to speechConfig', () => {
    const speechConfig = {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'voice-name',
        },
      },
    };
    expect(
      tSpeechConfig(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        'voice-name',
      ),
    ).toEqual(speechConfig);
  });
});

describe('tTool', () => {
  it('no change', () => {
    const tool = {functionDeclarations: [{name: 'function-name'}]};
    expect(
      tTool(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        tool,
      ),
    ).toEqual(tool);
  });
});

describe('tSchema', () => {
  it('no change', () => {
    const schema = {title: 'title'} as types.Schema;
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: false,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
  });
  it('throws error if default value is present for MLDev', () => {
    const schema = {
      type: 'STRING',
      properties: {
        'name': {
          type: 'STRING',
          default: 'test',
        },
      },
    } as types.Schema;
    expect(() => {
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: false,
          uploader: new CrossUploader(),
        }),
        schema,
      );
    }).toThrowError(
      'Default value is not supported in the response schema for the Gemini API.',
    );
  });
  it('processes anyOf', () => {
    const schema = {
      type: 'OBJECT',
      anyOf: [{type: 'STRING'}, {type: 'NUMBER'}],
    } as types.Schema;
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: false,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
  });
  it('processes items', () => {
    const schema = {
      type: 'OBJECT',
      properties: {
        type: {
          type: 'ARRAY',
          items: {
            type: 'STRING',
          },
        },
      },
    } as types.Schema;
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: false,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
  });
  it('process properties', () => {
    const schema = {
      type: 'OBJECT',
      properties: {
        type: {
          type: 'STRING',
        },
      },
    } as types.Schema;
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: true,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
    expect(
      tSchema(
        new ApiClient({
          auth: new FakeAuth(),
          vertexai: false,
          uploader: new CrossUploader(),
        }),
        schema,
      ),
    ).toEqual(schema);
  });
});

describe('tPart', () => {
  it('null', () => {
    expect(() => {
      tPart(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        null,
      );
    }).toThrowError('PartUnion is required');
  });

  it('undefined', () => {
    expect(() => {
      tPart(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        undefined,
      );
    }).toThrowError('PartUnion is required');
  });

  it('string', () => {
    expect(
      tPart(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        'test string',
      ),
    ).toEqual({text: 'test string'});
  });

  it('part object', () => {
    expect(
      tPart(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        {text: 'test string'},
      ),
    ).toEqual({text: 'test string'});
  });

  it('int', () => {
    expect(() => {
      tPart(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        // @ts-expect-error: escaping to test unsupported type
        123,
      );
    }).toThrowError('Unsupported part type: number');
  });
});

describe('tParts', () => {
  it('null', () => {
    expect(() => {
      tParts(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        null,
      );
    }).toThrowError('PartListUnion is required');
  });

  it('undefined', () => {
    expect(() => {
      tParts(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        undefined,
      );
    }).toThrowError('PartListUnion is required');
  });

  it('empty array', () => {
    expect(() => {
      tParts(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        [],
      );
    }).toThrowError('PartListUnion is required');
  });

  it('string array', () => {
    expect(
      tParts(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        ['test string 1', 'test string 2'],
      ),
    ).toEqual([{text: 'test string 1'}, {text: 'test string 2'}]);
  });

  it('string and part object', () => {
    expect(
      tParts(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        ['test string 1', {text: 'test string 2'}],
      ),
    ).toEqual([{text: 'test string 1'}, {text: 'test string 2'}]);
  });

  it('int', () => {
    expect(() => {
      tParts(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        // @ts-expect-error: escaping to test unsupported type
        123,
      );
    }).toThrowError('Unsupported part type: number');
  });

  it('int in array', () => {
    expect(() => {
      tParts(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        // @ts-expect-error: escaping to test unsupported type
        [123],
      );
    }).toThrowError('Unsupported part type: number');
  });
});

describe('tContent', () => {
  it('null', () => {
    expect(() => {
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        // @ts-expect-error: escaping to test unsupported type
        null,
      );
    }).toThrowError('ContentUnion is required');
  });

  it('undefined', () => {
    expect(() => {
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        undefined,
      );
    }).toThrowError('ContentUnion is required');
  });

  it('empty array', () => {
    expect(() => {
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        [],
      );
    }).toThrowError('PartListUnion is required');
  });

  it('number', () => {
    expect(() => {
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        // @ts-expect-error: escaping to test unsupported type
        123,
      );
    }).toThrowError('Unsupported part type: number');
  });

  it('function call part', () => {
    expect(
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        {
          functionCall: {name: 'function-name', args: {arg1: 'arg1'}},
        },
      ),
    ).toEqual({
      role: 'model',
      parts: [{functionCall: {name: 'function-name', args: {arg1: 'arg1'}}}],
    });
  });

  it('text part', () => {
    expect(
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        {text: 'test string'},
      ),
    ).toEqual({role: 'user', parts: [{text: 'test string'}]});
  });

  it('content', () => {
    expect(
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        {
          role: 'user',
          parts: [{text: 'test string'}],
        },
      ),
    ).toEqual({role: 'user', parts: [{text: 'test string'}]});
  });

  it('string', () => {
    expect(
      tContent(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        'test string',
      ),
    ).toEqual({role: 'user', parts: [{text: 'test string'}]});
  });
});

describe('tContents', () => {
  it('null', () => {
    expect(() => {
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        // @ts-expect-error: escaping to test error
        null,
      );
    }).toThrowError('contents are required');
  });

  it('undefined', () => {
    expect(() => {
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        undefined,
      );
    }).toThrowError('contents are required');
  });

  it('empty array', () => {
    expect(() => {
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        [],
      );
    }).toThrowError('contents are required');
  });

  it('content', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        {
          role: 'user',
          parts: [{text: 'test string'}],
        },
      ),
    ).toEqual([{role: 'user', parts: [{text: 'test string'}]}]);
  });

  it('text part', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        {text: 'test string'},
      ),
    ).toEqual([{role: 'user', parts: [{text: 'test string'}]}]);
  });

  it('function call part', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        {
          functionCall: {name: 'function-name', args: {arg1: 'arg1'}},
        },
      ),
    ).toEqual([
      {
        role: 'model',
        parts: [{functionCall: {name: 'function-name', args: {arg1: 'arg1'}}}],
      },
    ]);
  });

  it('string', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        'test string',
      ),
    ).toEqual([{role: 'user', parts: [{text: 'test string'}]}]);
  });

  it('array of contents', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        [
          {role: 'user', parts: [{text: 'test string 1'}]},
          {role: 'model', parts: [{text: 'test string 2'}]},
        ],
      ),
    ).toEqual([
      {role: 'user', parts: [{text: 'test string 1'}]},
      {role: 'model', parts: [{text: 'test string 2'}]},
    ]);
  });

  it('array of text parts', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        [{text: 'test string 1'}, {text: 'test string 2'}],
      ),
    ).toEqual([
      {
        role: 'user',
        parts: [{text: 'test string 1'}, {text: 'test string 2'}],
      },
    ]);
  });

  it('array of string mixed with text parts, contents', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        [
          'test string 1',
          {text: 'test string 2'},
          {role: 'user', parts: [{text: 'test string 3'}]},
          {functionCall: {name: 'function-name', args: {arg1: 'arg1'}}},
          {
            functionResponse: {
              name: 'function-name',
              response: {result: {answer: 'answer1'}},
            },
          },
          {role: 'model', parts: [{text: 'answer1'}]},
          'thank you',
        ],
      ),
    ).toEqual([
      {
        role: 'user',
        parts: [{text: 'test string 1'}, {text: 'test string 2'}],
      },
      {
        role: 'user',
        parts: [{text: 'test string 3'}],
      },
      {
        role: 'model',
        parts: [{functionCall: {name: 'function-name', args: {arg1: 'arg1'}}}],
      },
      {
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: 'function-name',
              response: {result: {answer: 'answer1'}},
            },
          },
        ],
      },
      {
        role: 'model',
        parts: [{text: 'answer1'}],
      },
      {
        role: 'user',
        parts: [{text: 'thank you'}],
      },
    ]);
  });

  it('array of array', () => {
    expect(
      tContents(
        new ApiClient({auth: new FakeAuth(), uploader: new CrossUploader()}),
        [
          'question1',
          {functionCall: {name: 'name1', args: {arg1: 'arg1'}}},
          {
            functionResponse: {
              name: 'name1',
              response: {result: {answer: 'answer1'}},
            },
          },
          {
            role: 'model',
            parts: [{text: 'answer1'}],
          },
          ['context2', 'question2'],
        ],
      ),
    ).toEqual([
      {
        role: 'user',
        parts: [{text: 'question1'}],
      },
      {
        role: 'model',
        parts: [{functionCall: {name: 'name1', args: {arg1: 'arg1'}}}],
      },
      {
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: 'name1',
              response: {result: {answer: 'answer1'}},
            },
          },
        ],
      },
      {
        role: 'model',
        parts: [{text: 'answer1'}],
      },
      {
        role: 'user',
        parts: [{text: 'context2'}, {text: 'question2'}],
      },
    ]);
  });
});
